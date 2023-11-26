import util from "util";
import { Chain } from "./chain";
import { ChainListOptions, ChainValue } from "./common";
import { S_CHAIN_LIST_FLAG } from "./constants";

const S_LIST = Symbol.for("@list_cache");

class BaseChainList<T extends Chain = Chain> {
  private readonly storage = new Map<string, T>();

  private readonly set = new Set<string>();
  private readonly cache = {};

  constructor(chains: T[] = [], options?: ChainListOptions) {
    if (options?.storage) {
      if (!util.types.isMap(options.storage)) throw TypeError("`options.storage` must be a Map");

      this.storage = options.storage;
    }

    chains.forEach(chain => {
      if (!Chain.isChain(chain)) throw new TypeError("Invalid chain type " + typeof(chain) + " at index " + chains.indexOf(chain));
      
      this.add(chain as T);
    });
  }

  /**
   * Creates a new instance of the class using the elements of an array-like object.
   *
   * @param {ArrayLike<A>} arrayLike - The array-like object to convert to an array.
   * @param {(v: A, k: number) => Chain} [mapfn] - Optional. A function that produces an element of the new array, taking three arguments: the current element, the current index, and the array-like object.
   * @param {any} [thisArg] - Optional. An object to which the this keyword can refer in the mapfn function. If thisArg is provided, it will be used as the this value for each invocation of the mapfn function.
   * @return {this} A new instance of the class.
   */
  static from<A = any, T extends Chain = Chain>(arrayLike: ArrayLike<A>, mapfn?: (v: A, k: number) => T, thisArg?: any) {
    return new this(Array.from(arrayLike, mapfn, thisArg));
  }

  /**
   * Creates a new instance of the class with the given items.
   *
   * @param {Chain[]} items - The items to be passed to the constructor.
   * @return {this} - A new instance of the class.
   */
  static of<T extends Chain = Chain>(...items: T[]) {
    return new this(items);
  }

  /**
   * Returns the sorted list of objects.
   *
   * @return {Chain[]} The list of objects.
   */
  protected get list(): T[] {
    if (this.cache[S_LIST]) return this.cache[S_LIST];
    return this.cache[S_LIST] = Array.from(this.set).map(id => this.storage.get(id)).sort((a, b) => a.chainId - b.chainId);
  }

  /**
   * Adds a chain to the list.
   *
   * @param {Chain} chain - The chain to be added.
   * @return {void} This function does not return anything.
   */
  add(chain: T): this {
    if (!Chain.isChain(chain)) return;
    this.set.add(chain.id);
    if (!this.storage.has(chain.id)) this.storage.set(chain.id, chain);
    delete this.cache[S_LIST];
    return this;
  }

  /**
   * Retrieves a value from the list and returns the corresponding Chain object.
   * if the value is duplicated with other chains, it will return the first one
   * @param {ChainValue | Chain} value - The value to look up in the list.
   * @return {Chain | undefined} The Chain object corresponding to the value, or undefined if the value is not found in the list.
   */
  get(value: ChainValue | T): T | undefined {
    const key = String(value);
    if (this.cache[key]) return this.storage.get(this.cache[key])
    
    const chain = this.list.find(chain => chain.equal(value));
    if (!chain) return undefined;

    this.cache[key] = chain.id;
    return chain;
  }

  /**
   * Deletes a chain from the list.
   *
   * @param {ChainValue | Chain} value - The value to be deleted from the list.
   * @return {boolean} Returns true if the value was successfully deleted from the list, false otherwise.
   */
  del(value: ChainValue | T): boolean {
    if (Chain.isChain(value) && this.set.has(value.id)) {
      this.set.delete(value.id)
      delete this.cache[String(value)];
      delete this.cache[S_LIST];
      return true;
    }

    const key = String(value);
    const chain = this.storage.get(this.cache[key]) && this.list.find(chain => chain.equal(value));
    if (!chain) return true;

    this.set.delete(chain.id);
    delete this.cache[key];
    delete this.cache[S_LIST];
    return true;
  }

  /**
   * Clears the list
   *
   * @param {none}
   * @return {void}
   */
  clear(): this {
    this.set.clear();
    Object.keys(this.cache).forEach(key => delete this.cache[key]);
    delete this.cache[S_LIST];
    return this;
  }

  /**
   * Determines whether the given value is included in the list.
   *
   * @param {ChainValue | Chain} value - The value to check for inclusion.
   * @return {boolean} Returns true if the value is included in the list, otherwise returns false.
   */
  include(value: ChainValue | T): boolean {
    if (Chain.isChain(value)) return this.set.has(value.id);
    return this.list.some(chain => chain.equal(value));
  }

  /**
   * Returns the array representation of the chains.
   *
   * @return {Array} The array representation of the chains.
   */
  toArray() {
    return this.list;
  }
  
  /**
   * Executes a provided function once for each chain in the list.
   *
   * @param {function} callbackfn - A function that performs an action on each chain.
   *   - `chain` - The current chain being processed.
   *   - `index` - The index of the current chain being processed.
   *   - `chains` - The array of chains being processed.
   * @return {void} This method does not return a value.
   */
  forEach(callbackfn: (chain: T, index: number, chains: T[]) => void) {
    return this.list.forEach(callbackfn);
  }

  /**
   * Returns the length of the list.
   *
   * @return {number} The length of the list.
   */
  get length() {
    return this.list.length;
  }

  // 顺序遍历元素
  [Symbol.iterator](): IterableIterator<T> {
    return this.list[Symbol.iterator]();
  }

  valueOf() {
    return this.list.valueOf();
  }
}


export class ChainList<T extends Chain = Chain>  extends BaseChainList<T> {
  private readonly [S_CHAIN_LIST_FLAG] = true;

  /**
   * Checks if the given object is a chain list.
   *
   * @param {any} object - The object to be checked.
   * @return {boolean} Returns true if the object is a chain list, otherwise false.
   */
  static isChainList(object): object is ChainList {
    return object && !!Object.hasOwnProperty.call(object, S_CHAIN_LIST_FLAG) && object[S_CHAIN_LIST_FLAG];
  }

  /**
   * Get the chain IDs from the list of chains.
   *
   * @return {number[]} An array of chain IDs.
   */
  getChainIds(): number[] {
    return this.list.map(chain => chain.chainId);
  }

  
  /**
   * Retrieves a list of active chains from the current list.
   *
   * @return {Array} The list of active chains.
   */
  getActiveChains() {
    return this.list.filter(chain => chain.active());
  }

  /**
   * Retrieves the inactive chains from the list.
   *
   * @return {Array} An array of inactive chains.
   */
  getInactiveChains() {
    return this.list.filter(chain => chain.inactive());
  }

  /**
   * Returns an array of active chain IDs.
   *
   * @return {Array<number>} An array of chain IDs.
   */
  getActiveChainIds() {
    return this.getActiveChains().map(chain => chain.chainId);
  }

  /**
   * Retrieves the chain IDs of all inactive chains.
   *
   * @return {Array<number>} An array of chain IDs.
   */
  getInactiveChainIds() {
    return this.getInactiveChains().map(chain => chain.chainId);
  }


  /**
   * Retrieves an array of test chains from the list of chains.
   *
   * @return {Array} An array of test chains.
   */
  getTestChains() {
    return this.list.filter(chain => chain.isTestnet());
  }

  /**
   * Returns an array of non-test chains.
   *
   * @return {Array} An array of non-test chains.
   */
  getNonTestChains() {
    return this.list.filter(chain => !chain.isTestnet());
  }

  /**
   * Retrieves the chain IDs of the test chains.
   *
   * @return {Array<number>} An array of chain IDs.
   */
  getTestChainIds() {
    return this.getTestChains().map(chain => chain.chainId);
  }

  /**
   * Retrieves the chain IDs of the non-test chains.
   *
   * @return {Array<number>} An array of chain IDs.
   */
  getNonTestChainIds() {
    return this.getNonTestChains().map(chain => chain.chainId);
  }
}