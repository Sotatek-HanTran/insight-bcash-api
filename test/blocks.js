'use strict';

var should = require('should');
var sinon = require('sinon');
var BlockController = require('../lib/blocks');
var bitcore = require('bitcore-lib');
var _ = require('lodash');

var blocks = require('./data/blocks.json');

var blockIndexes = {
  '0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7': {
    hash: '0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7',
    chainWork: '0000000000000000000000000000000000000000000000054626b1839ade284a',
    prevHash: '00000000000001a55f3214e9172eb34b20e0bc5bd6b8007f3f149fca2c8991a4',
    nextHash: '000000000001e866a8057cde0c650796cb8a59e0e6038dc31c69d7ca6649627d',
    confirmations: 119,
    height: 533974
  },
  '000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7': {
    hash: '000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7',
    chainWork: '00000000000000000000000000000000000000000000000544ea52e1575ca753',
    prevHash: '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441',
    confirmations: 119,
    height: 533951
  },
  '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441': {
    hash: '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441',
    chainWork: '00000000000000000000000000000000000000000000000544ea52e0575ba752',
    prevHash: '000000000001b9c41e6c4a7b81a068b50cf3f522ee4ac1e942e75ec16e090547',
    height: 533950
  },
  '000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4': {
    hash: '000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4',
    prevHash: '00000000000000000a9d74a7b527f7b995fc21ceae5aa21087b443469351a362',
    height: 375493
  },
  533974: {
    hash: '0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7',
    chainWork: '0000000000000000000000000000000000000000000000054626b1839ade284a',
    prevHash: '00000000000001a55f3214e9172eb34b20e0bc5bd6b8007f3f149fca2c8991a4',
    height: 533974
  }
};

describe('Blocks', function() {
  describe('/blocks/:blockHash route', function() {
    var insight = {
      'hash': '0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7',
      'confirmations': 119,
      'size': 1011,
      'height': 533974,
      'version': 536870919,
      'merkleroot': 'b06437355844b8178173f3e18ca141472e4b0861daa81ef0f701cf9e51f0283e',
      'tx': [
        {
          id: '25a988e54b02e0e5df146a0f8fa7b9db56210533a9f04bdfda5f4ceb6f77aadd',
          raw: '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff2303d6250800feb0aae355fe263600000963676d696e6572343208ae5800000000000000ffffffff01c018824a000000001976a91468bedce8982d25c3b6b03f6238cbad00378b8ead88ac00000000'
        },
        {
          id: 'b85334bf2df35c6dd5b294efe92ffc793a78edff75a2ca666fc296ffb04bbba0',
          raw: '0100000002ad5a14ae9d0f3221b790c4fc590fddceea1456e5692d8c4bf1ff7175f2b0c987000000008b4830450221008e5df62719cd92d7b137d00bbd27f153f2909bcad3a300960bc1020ec6d5e961022039df51600ff4fb5da5a794d1648c6b47c1f7d277fd5877fb5e52a730a3595f8c014104eb1e0ccd9afcac42229348dd776e991c69551ae3474340fada12e787e51758397e1d3afdba360d6374261125ea3b6ea079a5f202c150dfd729e1062d9176a307ffffffff9621ac65bc22ea593ca9a61a8d63e461bf3d3f277989df5d3bd33ddfae0aa1d8000000008a4730440220761464d7bab9515d92260762a97af82a9b25d202d8f7197b1aaec81b6fed541f022059f99606de6b06e17b2cd102dceb3807ebdd9e777a5b77c9a0b3672f5eabcb31014104eb1e0ccd9afcac42229348dd776e991c69551ae3474340fada12e787e51758397e1d3afdba360d6374261125ea3b6ea079a5f202c150dfd729e1062d9176a307ffffffff02dc374401000000001976a9144b7b335f978f130269fe661423258ae9642df8a188ac72b3d000000000001976a9146efcf883b4b6f9997be9a0600f6c095fe2bd2d9288ac00000000'
        },
        {
          id: '2e01c7a4a0e335112236b711c4aaddd02e8dc59ba2cda416e8f80ff06dddd7e1',
          raw: '0100000002060d3cb6dfb7ffe85e2908010fea63190c9707e96fc7448128eb895b5e222771030000006b483045022100f67cffc0ae23adb236ff3edb4a9736e277605db30cc7708dfab8cf1e1483bbce022052396aa5d664ec1cb65992c423fd9a17e94dc7af328d2d559e90746dd195ca5901210346134da14907581d8190d3980caaf46d95e4eb9c1ca8e70f1fc6007fefb1909dfeffffff7b2d8a8263cffbdb722e2a5c74166e6f2258634e277c0b08f51b578b667e2fba000000006a473044022077222a91cda23af69179377c62d84a176fb12caff6c5cbf6ae9e5957ff3b1afe0220768edead76819228dcba18cca3c9a5a5d4c32919720f21df21a297ba375bbe5c012103371ea5a4dfe356b3ea4042a537d7ab7ee0faabd43e21b6cc076fda2240629eeefeffffff02209a1d00000000001976a9148e451eec7ca0a1764b4ab119274efdd2727b3c8588ac40420f00000000001976a914d0fce8f064cd1059a6a11501dd66fe42368572b088accb250800'
        }
      ],
      'time': 1440987503,
      'nonce': 1868753784,
      'bits': '1a0cf267',
      'difficulty': 1295829.93087696,
      'chainwork': '0000000000000000000000000000000000000000000000054626b1839ade284a',
      'previousblockhash': '00000000000001a55f3214e9172eb34b20e0bc5bd6b8007f3f149fca2c8991a4',
      'nextblockhash': '000000000001e866a8057cde0c650796cb8a59e0e6038dc31c69d7ca6649627d',
      'reward': 12.5,
      'isMainChain': true,
      'poolInfo': {}
    };

    var bitcoreBlock = bitcore.Block.fromBuffer(new Buffer(blocks['0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7'], 'hex'));

    var node = {
      log: sinon.stub(),
      getBlock: sinon.stub().callsArgWith(1, null, bitcoreBlock),
      services: {
        bitcoind: {
          getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7']),
          isMainChain: sinon.stub().returns(true),
          height: 534092
        }
      }
    };

    it('block data should be correct', function(done) {
      var controller = new BlockController({node: node});
      var hash = '0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7';
      var req = {
        blockHashes: [hash]
      };
      var res = {
        jsonp: function(block) {
          should.exist(block);
          should(block).eql(insight);
          done();
        }
      };
      controller.block(req, res);
    });

    it('block pool info should be correct', function(done) {
      var block = bitcore.Block.fromString(blocks['000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4']);
      var node = {
        log: sinon.stub(),
        getBlock: sinon.stub().callsArgWith(1, null, block),
        services: {
          bitcoind: {
            getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4']),
            isMainChain: sinon.stub().returns(true),
            height: 534092
          }
        }
      };
      var controller = new BlockController({node: node});
      var hash = '000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4';
      var req = {
        blockHashes: [hash]
      };
      var res = {};
      var res = {
        jsonp: function(block) {
          should.exist(block);
          should.exist(block.poolInfo);
          should.exist(block.poolInfo.poolName);
          should.exist(block.poolInfo.url);

          block.poolInfo.poolName.should.equal('Discus Fish');
          block.poolInfo.url.should.equal('http://f2pool.com/');
          done();
        }
      };
      controller.block(req, res);
    });

    it('should return combined result on batch request', function(done) {
      var stub = sinon.stub();
      stub.onFirstCall().callsArgWith(1, null, bitcore.Block.fromBuffer(blocks['000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7'], 'hex'));
      stub.onSecondCall().callsArgWith(1, null, bitcore.Block.fromBuffer(blocks['00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441'], 'hex'))
      var req = {};

      var node = {
        log: sinon.stub(),
        getBlock: stub,
        services: {
          bitcoind: {
            getBlockHeader: sinon.stub().callsArgWith(1, null, blockIndexes['000000000000000004a118407a4e3556ae2d5e882017e7ce526659d8073f13a4']),
            isMainChain: sinon.stub().returns(true),
            height: 534092
          }
        }
      };

      var controller = new BlockController({node: node});

      var req = {
        blockHashes: [
          '000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7',
          '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441'
          ]
      };
      var res = {};
      var res = {
        jsonp: function(blocks) {
          should.exist(blocks);
          blocks.should.be.instanceof(Array).and.have.lengthOf(2);
          should.exist(blocks[0].hash);
          blocks[0].hash.should.be.equal('000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7');
          should.exist(blocks[1].hash);
          blocks[1].hash.should.be.equal('00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441');
          done();
        }
      };
      controller.block(req, res);
    });

  });

  it('should graceful fail on error', function(done) {
    var error = {
      code: -5,
      message: 'some error'
    };

    var node = {
      log: sinon.stub(),
      getBlock: sinon.stub().callsArgWith(1, error)
    };

    var controller = new BlockController({node: node});

    var res = {
      status: sinon.stub().returns({
        send: sinon.spy()
      })
    };

    controller.block({blockHashes: ['hash']}, res, function() {
      assert(false, 'should not call next middleware on fail');
    }, '');

    setTimeout(function() {
      res.status.callCount.should.equal(1);
      res.status.args[0][0].should.equal(404);
      done();
    });
  });

  describe('/blocks route', function() {

    var insight = {
      'blocks': [
        {
          'height': 533951,
          'size': 206,
          'hash': '000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7',
          'time': 1440978683,
          'txlength': 1,
          'poolInfo': {
            'poolName': 'AntMiner',
            'url': 'https://bitmaintech.com/'
          }
        },
        {
          'height': 533950,
          'size': 206,
          'hash': '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441',
          'time': 1440977479,
          'txlength': 1,
          'poolInfo': {
            'poolName': 'AntMiner',
            'url': 'https://bitmaintech.com/'
          }
        }
      ],
      'length': 2,
      'pagination': {
        'current': '2015-08-30',
        'currentTs': 1440979199,
        'isToday': false,
        'more': false,
        'next': '2015-08-31',
        'prev': '2015-08-29'
      }
    };

    var stub = sinon.stub();
    stub.onFirstCall().callsArgWith(1, null, new Buffer(blocks['000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7'], 'hex'));
    stub.onSecondCall().callsArgWith(1, null, new Buffer(blocks['00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441'], 'hex'));

    var hashes = [
      '00000000000006bd8fe9e53780323c0e85719eca771022e1eb6d10c62195c441',
      '000000000008fbb2e358e382a6f6948b2da24563bba183af447e6e2542e8efc7'
    ];
    var node = {
      log: sinon.stub(),
      services: {
        bitcoind: {
          getRawBlock: stub,
          getBlockHeader: function(hash, callback) {
            callback(null, blockIndexes[hash]);
          },
          getBlockHashesByTimestamp: sinon.stub().callsArgWith(2, null, hashes)
        }
      }
    };

    it('should have correct data', function(done) {
      var blocks = new BlockController({node: node});

      var req = {
        query: {
          limit: 2,
          blockDate: '2015-08-30'
        }
      };

      var res = {
        jsonp: function(data) {
          should(data).eql(insight);
          done();
        }
      };

      blocks.list(req, res);
    });
  });

  describe('/block-index/:height route', function() {
    var node = {
      log: sinon.stub(),
      services: {
        bitcoind: {
          getBlockHeader: function(height, callback) {
            callback(null, blockIndexes[height]);
          }
        }
      }
    };

    it('should have correct data', function(done) {
      var blocks = new BlockController({node: node});

      var insight = {
        'blockHash': '0000000000000afa0c3c0afd450c793a1e300ec84cbe9555166e06132f19a8f7'
      };

      var height = 533974;

      var req = {
        params: {
          height: height
        }
      };
      var res = {
        jsonp: function(data) {
          should(data).eql(insight);
          done();
        }
      };

      blocks.blockIndex(req, res);
    });
  });

  describe('#getBlockReward', function() {
    var node = {
      log: sinon.stub()
    };
    var blocks = new BlockController({node: node});

    it('should give a block reward of 50 * 1e8 for block before first halvening', function() {
      blocks.getBlockReward(100000).should.equal(50 * 1e8);
    });

    it('should give a block reward of 25 * 1e8 for block between first and second halvenings', function() {
      blocks.getBlockReward(373011).should.equal(25 * 1e8);
    });

    it('should give a block reward of 12.5 * 1e8 for block between second and third halvenings', function() {
      blocks.getBlockReward(500000).should.equal(12.5 * 1e8);
    });
  });
});
