import { Chain } from "../src/chain";
import { ChainList } from "../src/chain-list";
import data from "./_data";

describe('ChainList', () => {
  describe('new ChainList()', () => {
    it('should create a new instance by Chain[]', () => {
      const list = new ChainList(data.map(metadata => new Chain(metadata)));
      expect(list).toBeInstanceOf(ChainList);
    });
  });

  describe('ChainList.from()', () => {
    it('should create a new instance by Chain[]', () => {
      const list = ChainList.from(data.map(metadata => new Chain(metadata)));
      expect(list).toBeInstanceOf(ChainList);
    });

    it('should create a new instance by data with mapfn()', () => {
      const list = ChainList.from(data, (metadata => new Chain(metadata)));
      expect(list).toBeInstanceOf(ChainList);
    });
  });

  describe('ChainList.of()', () => {
    it('should create a new instance by Chain[]', () => {
      const list = ChainList.of(...data.map(metadata => new Chain(metadata)));
      expect(list).toBeInstanceOf(ChainList);
    });
  });

  describe('isChainList()', () => {
    it('should check if the given object is a chain list', () => {
      const list = new ChainList();
      expect(ChainList.isChainList(list)).toBe(true);
    });
  });

  describe('#get()', () => {
    it('should get a chain from the list', () => {
      const chain = new Chain(data[0]);
      const list = new ChainList([chain]);
      expect(list.get(chain.chainId)).toBeInstanceOf(Chain);
      expect(list.get(chain.chainId).toString()).toBe(chain.toString());
    });
  });

  describe('#add()', () => {
    it('should add a chain to the list', () => {
      const list = new ChainList();
      const chain = new Chain(data[0]);
      list.add(chain);
      expect(list.length).toBe(1);
      expect(list.get(chain.chainId)).toBeInstanceOf(Chain);
      expect(list.get(chain.chainId)).toBe(chain);
    });
  });

  describe('#del()', () => {
    it('should delete a chain from the list', () => {
      const chain = new Chain(data[0]);
      const list = new ChainList([chain]);
      expect(list.del(chain.chainId)).toBe(true);
      expect(list.length).toBe(data.length - 1);
    });
  });

  describe('#clear()', () => {
    it('should clear the list', () => {
      const chain = new Chain(data[0]);
      const list = new ChainList([chain]);
      list.toArray();
      list.clear();
      expect(list.length).toBe(0);
    });
  });

  describe('#include()', () => {
    it('should include a chain in the list', () => {
      const chain = new Chain(data[0]);
      const list = new ChainList();
      expect(list.include(chain)).toBe(false);
      list.add(chain);
      expect(list.include(chain)).toBe(true);
    });
  });

  describe('#toArray()', () => {
    it('should return the array representation of the list', () => {
      const chain = new Chain(data[0]);
      const list = new ChainList([chain]);
      expect(list.toArray()).toEqual([chain]);
    });
  });
  
  describe('#forEach()', () => {
    it('should iterate over the list', () => {
      const chain = new Chain(data[0]);
      const list = new ChainList([chain]);
      list.forEach(ele => {
        expect(ele).toBeInstanceOf(Chain);
        expect(ele.toString()).toBe(chain.toString());
      });
    });
  });

  describe('#length', () => {
    it('should return the length of the chain list', () => {
      const list = new ChainList(data.map(metadata => new Chain(metadata)));
      expect(list.length).toBe(data.length);
    });
  });

  describe('#valueOf()', () => {
    it('should return the value of the chain list', () => {
      const list = new ChainList(data.map(metadata => new Chain(metadata)));
      expect(list.valueOf()).toBeInstanceOf(Array);
      expect(list.valueOf()).toEqual(list.toArray());
    });
  });
});
