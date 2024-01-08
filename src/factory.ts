import get from "lodash.get";
import { Chain } from "./chain";
import { ChainList } from "./chain-list";
import { Chains } from "./chains";
import { ChainOptions, Metadata } from "./common";
import { ENV_DATA_DIR, ENV_DISABLE_AUTOLOAD, MODULE_PREFIX, required } from "./constants";
import { isNil, isNodeJS } from "./util";

/**
 * Builds chains from the given data.
 *
 * @param {Metadata[]} data - An array of objects representing metadata.
 * @param {ChainOptions} [options] - Optional options for building the chains.
 * @return {Chain[]} An array of Chain objects.
 */
export function buildChains(data: Metadata[], options?: ChainOptions) {
  return data.map(metadata => new Chain(metadata, options));
}

/**
 * Builds a chain list from the given data array and options.
 *
 * @param {Metadata[]} data - The array of metadata objects.
 * @param {ChainOptions} [options] - The options for building the chain list.
 * @return {ChainList} The built chain list.
 */
export function buildChainList(data: Metadata[], options?: ChainOptions) {
  const list = new ChainList()
  data.forEach(metadata => {
    list.add(new Chain(metadata, options));
  });
  return list;
}

function load(name) {
  const Path = require('path');
  try {
    return require(name);
  } catch (error) {
    return require(Path.resolve(process.cwd() + "/node_modules/" + name));
  }
}

function readFile(file, ext) {
  try {
    const fs = require('fs');
    switch (ext) {
      case '.yml':
      case '.yaml':
        return load('yaml').parse(fs.readFileSync(file, 'utf8'));
      case '.json':
      case '.json5':
        return load('json5').parse(fs.readFileSync(file, 'utf8'));
      default:
        return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function createDefaultChains(): Chains {
  const autoload = !get(process.env, ENV_DISABLE_AUTOLOAD);
  const result = [];
  
  if (autoload && isNodeJS()) {
    const fs = require('fs'), Path = require('path');
    const fn = metadata => {
      const available = required.every(property => !isNil(metadata[property]));
      if (available) result.push(metadata);
    }
    
    try {
      const path = get(process.env, ENV_DATA_DIR, Path.join(process.cwd(), 'chains'));
      fs.readdirSync(path).forEach((file) => {
        const ext = [
          ".json", 
          ".json5", 
          ".yml",
          ".yaml", 
        ].find((ext) => file.endsWith(ext));
        if (ext) {
          const data = readFile(Path.resolve(path, `./${file}`), ext);
          if (typeof data === 'object' && data !== null) {
            if(Array.isArray(data)) data.forEach(metadata => fn(metadata));
            else fn(data);
          }
        };
      });
    } catch (error) {
      if (get(process.env, ENV_DATA_DIR)) {
        console.warn(`[${MODULE_PREFIX}] ` + error.message);
      }
    }
  }

  return new Chains(result);
}