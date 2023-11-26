import { Chain, ChainList } from "src";
import { Chains } from "../src/chains";
import data from "./_data";

describe('Chains', () => {
  describe('new Chains()', () => {
    it('should create a new instance by metadata[]', () => {
      const chains = new Chains(data);
      expect(chains).toBeInstanceOf(Chains);
    });

    it('should create a new instance by Chain[]', () => {
      const chains = new Chains(data.map(metadata => new Chain(metadata)));
      expect(chains).toBeInstanceOf(Chains);
    });
  });

  describe('#globalChainList', () => {
    it('should return the global chain list', () => {
      const chains = new Chains(data);
      expect(chains.globalChainList).toBeInstanceOf(ChainList);
      expect(chains.globalChainList.length).toBe(data.length);
    });
  });

  describe('#createChainList()', () => {
    it('should create a chain list based on the given index values', () => {
      const chains = new Chains(data);
      const list = chains.createChainList([1, 10]);
      expect(list).toBeInstanceOf(ChainList);
      expect(list.get(1)).toBeInstanceOf(Chain);
      expect(list.length).toBe(2);
    });
  });

  describe('#addChainList()', () => {
    it('should add a chain list to the specified name with the given index values', () => {
      const chains = new Chains(data);
      const list = chains.addChainList("test", [1]);
      expect(list).toBeInstanceOf(ChainList);
      expect(chains.getChainList("test")).toBe(list);
    });
  });

  describe('#getChainList()', () => {
    it('should retrieve the chain list with a given name', () => {
      const chains = new Chains(data);
      const list = chains.addChainList("test", [1]);
      expect(chains.getChainList("test")).toBeInstanceOf(ChainList);
      expect(chains.getChainList("test").get(1)).toBeInstanceOf(Chain);
      expect(chains.getChainList("test").length).toBe(1);
      expect(chains.getChainList("test")).toBe(list);
    });
  });

  describe('#getChainListOrThrow()', () => {
    it('should retrieve the chain list with the specified name', () => {
      const chains = new Chains(data);
      const list = chains.addChainList("test", [1]);
      expect(chains.getChainListOrThrow("test")).toBe(list);
    });

    it('should throw an error if not found', () => {
      const chains = new Chains([]);
      expect(() => chains.getChainListOrThrow("test")).toThrow(Error);
    });
  });

  describe('#addChain()', () => {
    it('should add a chain to the global chain list', () => {
      const chains = new Chains([]);
      const chain = new Chain(data[0]);
      chains.addChain(chain);
      expect(chains.globalChainList.toArray()).toContain(chain);
    });
  });

  describe('#getChain()', () => {
    it('should return the value from the global chain list', () => {
      const chains = new Chains(data);
      expect(chains.getChain(1)).toBeInstanceOf(Chain);
    });
  });

  describe('#getChainOrThrow()', () => {
    it('should return the value from the global chain list', () => {
      const chains = new Chains(data);
      expect(chains.getChainOrThrow(1)).toBeInstanceOf(Chain);
    });

    it('should throw an error if not found', () => {
      const chains = new Chains([]);
      expect(() => chains.getChainOrThrow(1)).toThrow(Error);
    });
  });

  describe('#support()', () => {
    it('should support the specified chain', () => {
      const chains = new Chains(data);
      expect(chains.support(1)).toBe(true);
      expect(chains.support('Ethereum Mainnet')).toBe(true);
      expect(chains.support(-1)).toBe(false);
    });

    it('should support the specified chain with a chain list', () => {
      const chains = new Chains(data);
      chains.addChainList("test", [1]);
      expect(chains.support('test', 1)).toBe(true);
      expect(chains.support('test', 'Ethereum Mainnet')).toBe(true);
      expect(chains.support('test', -1)).toBe(false);
    });
  });

  describe('#supportOrThrow()', () => {
    it('should support the specified chain or throw an error', () => {
      const chains = new Chains(data);
      expect(chains.supportOrThrow(1)).toBe(true);
      expect(chains.supportOrThrow('Ethereum Mainnet')).toBe(true);
      expect(() => chains.supportOrThrow(-1)).toThrow(Error);
    });

    it('should support the specified chain or throw an error, with a chain list', () => {
      const chains = new Chains(data);
      chains.addChainList("test", [1]);
      expect(chains.supportOrThrow('test', 1)).toBe(true);
      expect(chains.supportOrThrow('test', 'Ethereum Mainnet')).toBe(true);
      expect(() => chains.supportOrThrow('test', -1)).toThrow(Error);
    });
  });
});
