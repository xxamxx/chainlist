import { createDefaultChains } from "./factory";

const defaultChains = createDefaultChains()

exports.module = defaultChains;
export default defaultChains;

export * from "./chain";
export * from "./chain-list";
export * from "./chains";
export * from "./common";

