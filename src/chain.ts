import get from "lodash.get";
import { ChainOptions, ChainStatusType, ChainValue, Metadata, NativeCurrency } from "./common";
import { S_CHAIN_FLAG, required } from "./constants";
import { deepCopy, defineReadOnly, equalInt, isIndexValue, isInt, isNil, parseDecimalInt } from "./util";

function getDefaultData() {
  return {
    name: "",
    chainId: null,
    shortName: "",
    chain: "",
    networkId: null,
    rpc: [],
    faucets: [],
    infoURL: "",
    testnet: false,
    status: "unknown",
    nativeCurrency: {
      name: "",
      symbol: "",
      decimals: null
    }
  }
}

class BaseChain {
  private readonly metadata: Metadata;
  private readonly tokens = {};

  readonly name: string;
  readonly chainId: number;

  constructor(metadata: Metadata, options?: ChainOptions) {
    const properties = Object.keys(metadata);
    const missing = required.filter(property => properties.indexOf(property) == -1);
    if (missing.length > 0) {
      throw new TypeError("Missing required fields: " + missing.join(", "));
    }

    // 本对象上的属性和值，不允许修改，但是赋值出去的允许修改
    this.metadata = deepCopy(metadata);

    properties.forEach((property) => {
      const value = this.metadata[property];
      defineReadOnly<any, any>(this, property, isInt(String(value)) ? parseDecimalInt(String(value)) : value);
    });

    // 索引
    if (options?.indexes?.length) {
      options.indexes.forEach((propertyPath) => {
        // 判断索引值类型必须为数值和字符串
        const value = get(this.metadata, propertyPath);
        if (isIndexValue(value)) {
          this.tokens[String(value)] = propertyPath;
        }
        else if (typeof value != "undefined") {
          throw new TypeError("Invalid index type: " + typeof(value));
        }
        // 跳过 undefined
      });
    }
  }

  /**
   * Retrieves the ID of the object.
   * - If the object has an id property, returns the value of the id property.
   * - If the object has an _id property, returns the value of the _id property.
   * - If the object has neither an _id nor an id property, returns a string representation of the object.
   *
   * @return {string} The ID of the object.
   */
  get id(): string {
    return this.get('_id', this.toString());
  }

  /**
   * Retrieves the value of a property from the chain using a property path.
   *
   * @param {string} propertyPath - The path of the property to retrieve.
   * @param {any} [defaultValue] - The default value to return if the property is not found.
   * @return {any} - The value of the property, or the defaultValue if the property is not found.
   */
  get<T>(propertyPath: string, defaultValue?: T): any | T {
    return get(this, propertyPath, defaultValue);
  }

  /**
   * Retrieves the value of the specified property path from the object. 
   * If the value is undefined, throws a Error.
   *
   * @param {string} propertyPath - The path of the property to retrieve.
   * @return {any} The value of the property.
   */
  getOrThrow(propertyPath: string): any {
    const value = get(this, propertyPath);  
    if (typeof value === 'undefined') {
      throw new Error(`Chain key "${propertyPath.toString()}" does not exist`);
    }
    return value;
  }

  /**
   * Checks if the provided value is included in the array of values.
   * - name
   * - chainId
   * - networkId
   *
   * @param {ChainValue} value - The value to check.
   * @return {boolean} Returns true if the value is included in the array, false otherwise.
   */
  is(value: ChainValue): boolean {
    return this.id === value
        || equalInt(this.chainId, value)
        || !isNil(this.get('networkId')) && equalInt(this.get('networkId'), value)
        || this.name === value;
  }

  /**
   * Determines whether the index value is included in the chain.
   * - name
   * - chainId
   * - networkId
   * - set index values
   *
   * @param {ChainValue} value - The value to check for inclusion.
   * @return {boolean} Returns true if the value is included, false otherwise.
   */
  equal(value: ChainValue): boolean {
    if (this.is(value)) return true;
    
    const propertyPath = this.tokens[String(value)];
    if (!propertyPath) return false;
    return !!this.get(propertyPath);
  }

  /**
   * Retrieves the indexes of the chain.
   *
   * @return {string[]} An array of strings representing the indexes of the tokens.
   */
  indexes(): string[] {
    return Object.values(this.tokens);
  }
  
  /**
   * Retrieves an array of index values.
   *
   * @return {string[]} An array of index values.
   */
  indexValues(): string[] {
    return Object.keys(this.tokens);
  }

  toString(): string {
    return String(parseDecimalInt(this.chainId + ''));
  }
}

export class Chain extends BaseChain {
  private readonly [S_CHAIN_FLAG] = true;

  readonly [ key: string ]: any;
  readonly networkId?: number;
  readonly shortName?: string;
  readonly chain?: string;
  readonly rpc?: string[];
  readonly faucets?: string[];
  readonly infoURL?: string;
  readonly nativeCurrency?: NativeCurrency;
  readonly status?: ChainStatusType;
  readonly testnet?: boolean;

  /**
   * Checks if the given object is a chain.
   *
   * @param {any} object - The object to check.
   * @return {boolean} Returns `true` if the object is a chain, `false` otherwise.
   */
  static isChain(object): object is Chain {
    return object && !!Object.hasOwnProperty.call(object, S_CHAIN_FLAG) && object[S_CHAIN_FLAG];
  }

  /**
   * Determines whether the index value is included in the chain.
   *
   * @param {ChainValue | Chain} value - The value to check for inclusion.
   * @return {boolean} Returns true if the value is included, false otherwise.
   */
  equal(value: ChainValue | Chain): boolean {
    if (isNil(value)) return false;

    if (Chain.isChain(value)) return this === value || (this.name === value.name && this.chainId === value.chainId);

    return super.equal(value);
  }

  /**
   * Checks if the chain is a testnet.
   *
   * @return {boolean} Returns a boolean indicating whether the chain is a testnet.
   */
  isTestnet(): boolean {
    return this.get('testnet', false);
  }

  /**
   * Checks if the chain status is active, default is active.
   *
   * @return {boolean} Returns true if the status is active, otherwise false.
   */
  active(): boolean {
    return this.get('status', "active") === "active";
  }

  /**
   * Determines if the chain status is inactive.
   *
   * @return {boolean} - Returns `true` if the chain is inactive, `false` otherwise.
   */
  inactive(): boolean {
    return this.get('status', "active") !== "active";
  }

  /**
   * Check if the given feature is supported.
   *
   * @param {string} feature - The feature to check for support.
   * @return {boolean} Returns `true` if the feature is supported, `false` otherwise.
   */
  supportFeature(feature: string): boolean {
    return this.supportedFeatures().indexOf(feature) > -1;
  }

  /**
   * Returns an array of supported features.
   *
   * @return {string[]} An array of feature names.
   */
  supportedFeatures(): string[] {
    const features = [];
    this.get('features', [])
      .forEach(feature => !isNil(feature?.name) && features.push(feature.name));
    return features;
  }
}