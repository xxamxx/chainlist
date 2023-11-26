export const required = ["name", "chainId"];

export const MODULE_PREFIX = "EVM_CHAINLIST";

// Symbols
export const S_CHAIN_FLAG = Symbol.for("@ChainConstructor");
export const S_CHAIN_LIST_FLAG = Symbol.for("@ChainListConstructor");

// Types
export const INDEX_TYPES = ["string", "number", "bigint"];

// Environment Variables
export const ENV_DISABLE_AUTOLOAD = MODULE_PREFIX + '_DISABLE_AUTOLOAD';
export const ENV_DATA_DIR = MODULE_PREFIX + '_DATA_DIR';