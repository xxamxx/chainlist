import Path from "path";
import { Chain } from "src/chain";
import { ChainList } from "src/chain-list";
import { Chains } from "src/chains";
import { ENV_DATA_DIR, ENV_DISABLE_AUTOLOAD } from "src/constants";

describe('Module', () => {
  describe('default chains instance', () => {
    const dir = Path.resolve(__dirname, './_data');

    afterEach( function() {
      jest.resetModules();
      delete require.cache[require.resolve('../src')]
      delete process.env[ENV_DATA_DIR];
      delete process.env[ENV_DISABLE_AUTOLOAD];
    });

    test(`should return import default chains with \`${ENV_DATA_DIR}\` env`, async () => {
      process.env[ENV_DATA_DIR] = dir;
      const {default: chains, Chains: ChainsClass} = await import('../src');
      
      expect(chains).toBeInstanceOf(ChainsClass);
      expect(chains.support(1)).toBe(true);
      expect(chains.support(10)).toBe(true);
    });
    
    test(`should return require default chains with \`${ENV_DATA_DIR}\` env`, async () => {
      process.env[ENV_DATA_DIR] = dir;
      const {default: chains, Chains: ChainsClass} = require('../src');
      
      expect(chains).toBeInstanceOf(ChainsClass);
      expect(chains.support(1)).toBe(true);
      expect(chains.support(10)).toBe(true);
    });
    
    test(`should return import empty chains with \`${ENV_DISABLE_AUTOLOAD}\` env`, async () => {
      process.env[ENV_DATA_DIR] = dir;
      process.env[ENV_DISABLE_AUTOLOAD] = 'true';
      const {default: chains, Chains: ChainsClass} = require('../src');

      expect(chains).toBeInstanceOf(ChainsClass);
      expect(chains.support(1)).toBe(false);
      expect(chains.support(10)).toBe(false);
    })
  });

  describe('Chains class', () => {
    test('should get Chains class', () => {
      const {Chains: ChainsClass} = require('../src');
      expect(ChainsClass).toBeInstanceOf(Function);
      expect(ChainsClass.constructor).toBe(Chains.constructor);
    });
  });

  describe('Chain class', () => {
    test('should get Chain class', () => {
      const {Chain: ChainClass} = require('../src');
      expect(ChainClass).toBeInstanceOf(Function);
      expect(ChainClass.constructor).toBe(Chain.constructor);
    });
  });

  describe('ChainList class', () => {
    test('should get ChainList class', () => {
      const {ChainList: ChainListClass} = require('../src');
      expect(ChainListClass).toBeInstanceOf(Function);
      expect(ChainListClass.constructor).toBe(ChainList.constructor);
    });
  });
});
