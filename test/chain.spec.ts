import { Chain } from "../src/chain";
import data from "./_data";

describe('Chain', () => {
  describe('new Chain()', () => {
    it('should create a new instance by metadata', () => {
      const chain = new Chain(data[0]);
      expect(chain).toBeInstanceOf(Chain);
    });

    it('should throw an TypeError', () => {
      expect(() => new Chain({} as any)).toThrow(TypeError);
    });
  });

  describe('.isChain()', () => {
    it('should return true if the value is a Chain', () => {
      const chain = new Chain(data[0]);
      expect(Chain.isChain(chain)).toBe(true);
    });
  });

  describe('#name', () => {
    it('should return the name from metadata.name', () => {
      const chain = new Chain(data[0]);
      expect(chain.name).toBe(data[0].name);
    });
  });

  describe('#chainId', () => {
    it('should return the chainId from metadata.chainId', () => {
      const chain = new Chain(data[0]);
      expect(chain.chainId).toBe(data[0].chainId);
    });
  });

  describe('#id', () => {
    it('should return the ID from metadata.id', () => {
      const metadata = Object.assign({id: 'Test'}, data[0]);
      const chain = new Chain(metadata);
      expect(chain.id).toBe('Test');
    });

    it('should return the ID from metadata._id', () => {
      const metadata = Object.assign({_id: 'Test'}, data[0]);
      const chain = new Chain(metadata);
      expect(chain.id).toBe('Test');
    });

    it('should return the ID of the object', () => {
      const chain = new Chain(data[0]);
      expect(chain.id).toBe(chain.toString());
    });
  });
  
  describe('#get()', () => {
    it('should return the value of the specified property', () => {
      const chain = new Chain(data[0]);
      expect(chain.get('id')).toBe(chain.id);
    });

    it('should return the value of the metadata properties', () => {
      const chain = new Chain(data[0]);
      Object.keys(data[0]).forEach((property) => {
        expect(chain.get(property)).toEqual(data[0][property]);
      });
    });
  });

  describe('#getOrThrow()', () => {
    it('should return the value of the specified property', () => {
      const chain = new Chain(data[0]);
      expect(chain.getOrThrow('id')).toBe(chain.id);
    });

    it('should throw an error if the property does not exist', () => {
      const chain = new Chain(data[0]);
      expect(() => chain.getOrThrow('test')).toThrow();
    });
  });

  describe('#toString()', () => {
    it('should return the ID of the metadata', () => {
      const chain = new Chain(data[0]);
      expect(chain.toString()).toBe(`${data[0].name}(${data[0].chainId})`);
    });
  });

  describe('#is()', () => {
    it('should return true if the value is in the metadata', () => {
      const chain = new Chain(data[0]);
      expect(chain.is(data[0].name)).toBe(true);
      expect(chain.is(data[0].chainId)).toBe(true);
      expect(chain.is(data[0].networkId)).toBe(true);
      expect(chain.is(`${data[0].name}(${data[0].chainId})`)).toBe(true);
    });
  });

  describe('#equal()', () => {
    it('should return true if the value is in the metadata', () => {
      const chain = new Chain(data[0], {indexes: ['icon', 'nativeCurrency.symbol']});

      expect(chain.equal(undefined)).toBe(false);
      expect(chain.equal(null)).toBe(false);

      expect(chain.equal(chain)).toBe(true);
      expect(chain.equal({name: chain.name, chainId: chain.chainId} as Chain)).toBe(false);
      expect(chain.equal(new Object() as Chain)).toBe(false);

      expect(chain.equal(data[0].name)).toBe(true);
      expect(chain.equal(data[0].chainId)).toBe(true);
      expect(chain.equal(data[0].networkId)).toBe(true);
      expect(chain.equal(`${data[0].name}(${data[0].chainId})`)).toBe(true);
      
      expect(chain.equal(data[0].icon)).toBe(true);
      expect(chain.equal(data[0].nativeCurrency.symbol)).toBe(true);
    });
  });

  describe('#indexes()', () => {
    it('should return the indexes of the metadata', () => {
      const chain = new Chain(data[0], {indexes: ['icon', 'nativeCurrency.symbol']});
      expect(chain.indexes()).toEqual(['icon', 'nativeCurrency.symbol']);
    });
  });

  describe('#indexValues()', () => {
    it('should return the index values of the metadata', () => {
      const chain = new Chain(data[0], {indexes: ['icon', 'nativeCurrency.symbol']});
      expect(chain.indexValues()).toEqual(['ethereum', 'ETH']);
    });
  });

  describe('#isTestnet()', () => {
    it('should return true if the chain is a testnet', () => {
      const chain = new Chain({testnet: true, ...data[0]});
      expect(chain.isTestnet()).toBe(true);
    });

    it('should return false if the chain is not a testnet', () => {
      const chain = new Chain(data[0]);
      expect(chain.isTestnet()).toBe(false);
    });
  });

  describe('#active()', () => {
    it('should return true, default is active', () => {
      const chain = new Chain(data[0]);
      expect(chain.active()).toBe(true);
    });

    it('should return false if the chain status is not active', () => {
      const chain = new Chain({status: 'test', ...data[0]});
      expect(chain.active()).toBe(false);
    });
  });

  describe('#inactive()', () => {
    it('should return true if the chain status is inactive', () => {
      const chain = new Chain({status: 'inactive', ...data[0]});
      expect(chain.inactive()).toBe(true);
    });

    it('should return true if the chain status is not inactive', () => {
      const chain = new Chain({status: 'test', ...data[0]});
      expect(chain.inactive()).toBe(true);
    });
  });

  describe('#supportFeature()', () => {
    it('should return true if the chain has features', () => {
      const chain = new Chain(data[0]);
      expect(chain.supportFeature('EIP155')).toBe(true);
    });

    it('should return false if the chain does not have features', () => {
      const chain = new Chain({...data[0], features: []});
      expect(chain.supportFeature('EIP155')).toBe(false);
    });
  });

  describe('#supportedFeatures()', () => {
    it('should return true if the chain has features', () => {
      const chain = new Chain(data[0]);
      expect(chain.supportedFeatures()).toEqual(['EIP155', 'EIP1559']);
    });

    it('should return false if the chain does not have features', () => {
      const chain = new Chain({...data[0], features: []});      
      expect(chain.supportedFeatures()).toEqual([]);
    });
  });
});
