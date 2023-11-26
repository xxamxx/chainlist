# Chainlist

`chainlist` for easy manage and access to EVM-based Chains information
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/your-username/your-project/blob/master/LICENSE)

> ⚠️ This package is still in the development stage, please do not use it in the production environment!!!

## Description

the project is a library for interacting with metadata of the Chain. It provides a set of functions for reading metadata to the chain object, managing listings.

when your project need maintain multiple chain or access the metadata of chains, `chainlist` can help you.

## Features

- Manage multiple chains
- Compatible fields
- Flexible access
- Extensible

## Installation

```bash
npm i evm-chainlist
```

or

```bash
yarn add evm-chainlist
```

## Environment Variables

- `EVM_CHAINLIST_DISABLE_AUTOLOAD` Disable autoload the data of chains, will export an empty instance of Chains.
- `EVM_CHAINLIST_DATA_DIR` This contains the path to the directory containing your chains files, them will be autoload to instance of Chains, default read `process.cwd() + '/chains'` directory, the file extension can be `.json`, `.json5`, `.yaml`, `.yml`, **the chains data must includes `name` and `chainId` fields**;

## Usage

We have some metadata for chains. you can find them here [ethereum-lists/chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains).

```typescript
const ethereumMetadata = {
  "name": "Ethereum Mainnet",
  "chain": "ETH",
  "icon": "ethereum",
  "features": [{ "name": "EIP155" }, { "name": "EIP1559" }],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ethereum.org",
  "shortName": "eth",
  "chainId": 1,
  "networkId": 1,
  "code": "ethereum"
};

const rinkebyMetadata = {
  "name": "Rinkeby",
  "title": "Ethereum Testnet Rinkeby",
  "chain": "ETH",
  "nativeCurrency": {
    "name": "Rinkeby Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.rinkeby.io",
  "shortName": "rin",
  "chainId": 4,
  "networkId": 4,
  "status": "inactive"
};

const goerliMetadata = {
  "name": "Goerli",
  "title": "Ethereum Testnet Goerli",
  "chain": "ETH",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://goerli.net/#about",
  "shortName": "gor",
  "chainId": 5,
  "networkId": 5,
  "testnet": true,
  "alias": {
    "internal": "goerli"
  }
};
```

### Chain

It's like access ordinary JSON objects, but it provide index and useful methods

```typescript
import { Chain } from 'evm-chainlist';

// Get ethereum
const ethereum = new Chain(ethereumMetadata);
const rinkeby = new Chain(rinkebyMetadata);
// Get goerli, and set indexes
const goerli = new Chain(goerliMetadata, {indexes: ['alias.internal']});

// Access metadata
console.log(ethereum.get('nativeCurrency.name')); // Output: Ether
console.log(ethereum.name); // Output: Ethereum Mainnet
console.log(ethereum.infoURL); // Output: https://ethereum.org
console.log(goerli.title); // Output: Ethereum Testnet Goerli

// Default indexes: name, chainId, networkId
console.log(goerli.equal('Ethereum Mainnet'); // Output: true
console.log(ethereum.equal(1); // Output: true
console.log(ethereum.equal('ethereum')); // Output: false

// Specify indexes
console.log(goerli.equal('goerli')); // Output: true
console.log(goerli.indexes()); // Output: ['alias.internal']
console.log(goerli.indexValues()); // Output: ['goerli']

// Provide methods
console.log(ethereum.isTestnet(), goerli.isTestnet()); // Output: false true
console.log(rinkeby.supportFeature('EIP155')); // Output: false
console.log(goerli.active(), rinkeby.inactive()); // Output: true true
// ...
```

### ChainList

Some businesses only support some chains

```typescript
import { ChainList } from 'evm-chainlist';

// Instantiate by Chain or metadata
const list = new ChainList([ethereumMetadata, rinkebyMetadata]);

// Add Chain
list.add(new Chain(goerliMetadata, {indexes: ['alias.internal']}));

// Access chain by index value
const ethereum = list.get(1);
console.log(ethereum.name); // Output: Ethereum Mainnet

const goerli = list.get('goerli');
console.log(goerli.name); // Output: Goerli

console.log(list.include(4)); // Output: true

// Del chain by index value
list.del('Rinkeby');

// ...
```

### Chains

Global access all chain and list.

```typescript
import { Chains } from 'evm-chainlist';

const data = [{
  "name": "Ethereum Mainnet",
  "chainId": 1
}, {
  "name": "OP Mainnet", 
  "chainId": 10
}, {
  "name": "Binance Smart Chain",
  "chainId": 56
}, {
  "name": "Kovan",
  "chainId": 42
}, {
  "name": "Rinkeby",
  "chainId": 4
}];

// Instantiate by Chain or metadata
const chains = new Chains(data, {lists: {
  'business1': [1, 56, 5],
}});

// Add Chain
chains.addChain(new Chain({
  "name": "Goerli",
  "chainId": 5,
  "alias": {
    "internal": "goerli"
  }
}, {indexes: ['alias.internal']}));

const rinkeby = chains.getChain(4);
console.log(rinkeby.name); // Output: Rinkeby

// Add ChainList
chains.addChainList('test', ['goerli', 42]);

// Access ChainList
const testList = chains.getChainList('test');
console.log(testList.include(5)); // Output: true

// ...
```

This module will autoload the chains data and export the instance of Chains;

```typescript
import chains, { Chains } from 'evm-chainlist';
// import defaults the instance of Chains through auto load your project 'chains' directory

console.log(chains instanceof Chinas);  // Output: true
```

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. Make sure to read the contribution guidelines before getting started.

## License

This project is licensed under the MIT License.
