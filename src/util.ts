import { ChainValue } from "./common";
import { INDEX_TYPES } from "./constants";

export function defineReadOnly<T, K extends keyof T>(object: T, name: K, value: T[K]): void {
  Object.defineProperty(object, name, {
      configurable: false,
      enumerable: true,
      value: value,
      writable: false,
  });
}

const opaque: { [key: string]: boolean } = { bigint: true, boolean: true, "function": true, number: true, string: true };

function _isFrozen(object: any): boolean {

  // Opaque objects are not mutable, so safe to copy by assignment
  if (object === undefined || object === null || opaque[typeof(object)]) { return true; }

  if (Array.isArray(object) || typeof(object) === "object") {
      if (!Object.isFrozen(object)) { return false; }

      const keys = Object.keys(object);
      for (let i = 0; i < keys.length; i++) {
          let value: any = null;
          try {
              value = object[keys[i]];
          } catch (error) {
              // If accessing a value triggers an error, it is a getter
              // designed to do so (e.g. Result) and is therefore "frozen"
              continue;
          }

          if (!_isFrozen(value)) { return false; }
      }

      return true;
  }

  return false;
}

// Returns a new copy of object, such that no properties may be replaced.
// New properties may be added only to objects.
function _deepCopy(object: any): any {

  if (_isFrozen(object)) { return object; }

  // Arrays are mutable, so we need to create a copy
  if (Array.isArray(object)) {
      return Object.freeze(object.map((item) => deepCopy(item)));
  }

  if (typeof(object) === "object") {
      const result: { [ key: string ]: any } = {};
      for (const key in object) {
          const value = object[key];
          if (value === undefined) { continue; }
          defineReadOnly(result, key, deepCopy(value));
      }

      return result;
  }

  return undefined;
}

export function deepCopy<T>(object: T): T {
  return _deepCopy(object);
}

// end-on system
export function parseDecimalInt(v: string) {
  if(v.toLowerCase().indexOf("0x") == 0) return parseInt(v, 16);
  if(v.toLowerCase().indexOf("0b") == 0) return parseInt(v, 2);
  if(v.toLowerCase().indexOf("0o") == 0) return parseInt(v, 8);
  if(v.toLowerCase().indexOf("0") == 0) return parseInt(v, 8);
  return parseInt(v, 10);
}

export function isInt(value: string) {
  return !isNaN(parseDecimalInt(value));
}

export function equalInt(value1, value2) {
  if (typeof(value1) === 'string') value1 = parseDecimalInt(value1);
  if (typeof(value2) === 'string') value2 = parseDecimalInt(value2);
  return value1 === value2;
}

export function isIndexValue(value): value is ChainValue {
  return INDEX_TYPES.indexOf(typeof(value)) > -1
}

export function isNil(value) {
  return value === null || typeof value === 'undefined'
}