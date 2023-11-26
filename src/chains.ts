import { Chain } from "./chain";
import { ChainList } from "./chain-list";
import { ChainsOptions, ChainValue, Metadata } from "./common";
import { buildChains } from "./factory";

export class Chains<T extends Chain = Chain> {
  readonly globalChainList: ChainList<T>;

  protected readonly storage: Map<string, T>;
  protected readonly lists = new Map<string, ChainList<T>>();

  constructor(
    data: Metadata[] | T[],
    options: ChainsOptions<T> = {},
  ) {
    const {lists, storage, ...opts} = options;

    this.storage = storage || new Map<string, T>();
    
    if (Array.isArray(data) && data.length) {
      const chains = Chain.isChain(data[0]) ? data as T[] : buildChains(data, opts) as T[];
      chains.forEach(chain => this.storage.set(chain.id, chain));
      this.globalChainList = new ChainList(chains, {storage: this.storage});
    }
    else {
      this.globalChainList = new ChainList([], {storage: this.storage});
    }

    if (!lists) return this;

    if (typeof lists !== 'object') {
      throw new TypeError('`options.lists` must be an object');
    }

    Object.keys(lists).forEach(key => {
      if (!Array.isArray(lists[key]) || !lists[key]?.length) return;

      this.addChainList(key, lists[key]);
    });
  }

  /**
   * Creates a chain list based on the given index values.
   *
   * @param {ChainValue[]} indexValues - An array of index values.
   * @return {ChainList<T>} The created chain list.
   */
  createChainList(indexValues: ChainValue[]): ChainList<T> {
    const list = new ChainList<T>([], {storage: this.storage});
    indexValues.forEach(value => this.globalChainList.get(value) && list.add(this.globalChainList.get(value)));
    return list;
  }

  /**
   * Adds a chain list to the specified name with the given index values.
   *
   * @param {string} name - The name of the chain list.
   * @param {ChainValue[]} indexValue - The index values to be added to the chain list.
   * @returns {ChainList<T>} - The newly created chain list.
   */
  addChainList(name: string, indexValue: ChainValue[]): ChainList<T> {
    const list = new ChainList<T>([], {storage: this.storage});
    indexValue.forEach(value => this.globalChainList.get(value) && list.add(this.globalChainList.get(value)));
    this.lists.set(name, list);
    return list;
  }

  /**
   * Retrieves the chain list with a given name.
   *
   * @param {string} name - The name of the chain list to retrieve.
   * @return {ChainList | undefined} - The chain list with the given name, or undefined if not found.
   */
  getChainList(name: string): ChainList<T> | undefined {
    return this.lists.get(name);
  }

  /**
   * Retrieves the chain list with the specified name, or throws an error if not found.
   *
   * @param {string} name - The name of the chain list.
   * @return {ChainList<T>} The chain list with the specified name, or throws an error if not found.
   */
  getChainListOrThrow(name: string): ChainList<T> {
    const list = this.lists.get(name);
    if (!list) throw new Error(`Chain list '${name}' not found!`);
    return list;
  }

  /**
   * Adds a chain to the global chain list.
   *
   * @param {Chain} chain - The chain to be added.
   * @return {this} The current instance.
   */
  addChain(chain: T): this {
    this.globalChainList.add(chain);
    return this;
  }

  /**
   * Returns the value from the global chain list.
   *
   * @param {ChainValue} value - the value to retrieve from the global chain list
   * @return {Chain | undefined} the value from the global chain list, or undefined if not found
   */
  getChain(value): T | undefined {
    return this.globalChainList.get(value);
  }

  /**
   * Retrieves the chain associated with the given value, or throws an error if not found.
   *
   * @param {ChainValue} value - The value to search for in the global chain list.
   * @return {Chain} The chain associated with the given value, or throws an error if not found.
   */
  getChainOrThrow(value): T {
    const chain = this.globalChainList.get(value);
    if (!chain) throw new Error(`Chain '${value}' not found!`);
    return chain;
  }

  /**
   * Determines whether the given value is supported in the specified list.
   *
   * @param {string} listName - The value is the name of the list.
   * @param {ChainValue | ChainValue[]} value - The value to check for support.
   * @return {boolean} Returns true if the value is included in the list, otherwise returns false.
   */
  support(listName: string, value: ChainValue): boolean;
  /**
   * Determines whether the given value is supported in the global chain list.
   *
   * @param {ChainValue | ChainValue[]} value - The value to check for support.
   * @return {boolean} Returns true if the value is included in the list, otherwise returns false.
   */
  support(value: ChainValue | ChainValue[]): boolean;
  support(...args: any[]): boolean {
    if (args.length <= 0) throw new TypeError("Must provide arguments!");
    if (args.length === 1) {
      if (Array.isArray(args[0])) {
        return args[0].every(chain => this.globalChainList.include(chain));
      }
      return this.globalChainList.include(args[0]);
    }

    if (Array.isArray(args[1])) {
      return args[1].every(chain => !!this.getChainList(args[0])?.include(chain));
    }
    return !!this.getChainList(args[0])?.include(args[1]);
  }

  /**
   * Determines whether the given value is supported in the specified list.
   *
   * @param {string} listName - The value is the name of the list.
   * @param {ChainValue | ChainValue[]} value - The value to check for support.
   * @return {boolean} Returns true if the value is supported, otherwise returns throw a TypeError.
   */
  supportOrThrow(listName: string, value: ChainValue | ChainValue[]): boolean;
  /**
   * Determines whether the given value is supported in the global chain list.
   *
   * @param {ChainValue | ChainValue[]} value - The value to check for support.
   * @return {boolean} Returns true if the value is supported, otherwise returns throw a TypeError.
   */
  supportOrThrow(value: ChainValue | ChainValue[]): boolean;
  supportOrThrow(...args: any[]): boolean {
    if (args.length <= 0) throw new TypeError("Must provide arguments!");
    if (args.length === 1) {
      if (Array.isArray(args[0])) {
        const index = args[0].findIndex(chain => !this.support(chain));
        if (index > -1) throw new Error(`Chain '${args[0][-1]}' is not supported!`);
        return true;
      }

      if (!this.support(args[0])) throw new Error(`Chain '${args[0]}' is not supported!`);
      return true;
    }

    if (Array.isArray(args[1])) {
      const index = args[1].findIndex(chain => !this.support(args[0], chain));
      if (index > -1) throw new Error(`Chain '${args[1][-1]}' is not supported!`);
      return true;
    }

    if (!this.support(args[0], args[1])) throw new Error(`Chain '${args[1]}' is not supported!`);
    return true;
  }
}