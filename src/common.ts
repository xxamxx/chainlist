import { Chain } from "./chain";

export type NativeCurrency = {
  name?: string;
  symbol?: string;
  decimals?: number;
}

export enum ChainStatus {
  Unknown = "unknown",
  Active = "active",
  Inactive = "inactive",
}

export type ChainStatusType = ChainStatus | string;

export type Metadata = {
  name: string;
  chainId: number;
  shortName?: string;
  chain?: string;
  networkId?: number;
  rpc?: string[];
  faucets?: string[];
  infoURL?: string;
  nativeCurrency?: NativeCurrency;
  testnet?: boolean;
  status?: ChainStatusType;
} & Record<string, any>;

export type ChainOptions = { 
  indexes?: string[]
}

export type ChainsOptions<T extends Chain = Chain> = {
  storage?: Map<string, T>;
  lists?: Record<string, number[]>
} & ChainOptions


export type ChainListOptions<T = any> = {
  storage?: Map<string, T>;
}

export type ChainValue = string | number | bigint;