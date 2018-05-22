
var _ = require('lodash');
var chai = require('chai');
var sinon = require('sinon');
var assert = require('assert');
var should = chai.should;

var AddressTranslator = require('../lib/addresstranslator');

describe('#AddressTranslator', function() {
  it('should translate address from btc to bch', function() {
    var res = AddressTranslator.translate('1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA', 'bch');
    assert( res == 'bitcoincash:qrvcdmgpk73zyfd8pmdl9wnuld36zh9n4gms8s0u59');
  });
  it('should translate address from bch to btc', function() {
    var res = AddressTranslator.translateInput('HBf8isgS8EXG1r3X6GP89FmooUmiJ42wHS');
    assert(res=='36q2G5FMGvJbPgAVEaiyAsFGmpkhPKwk2r');
  });

  it('should keep the address if there is nothing to do (bch)', function() {
    var res = AddressTranslator.translate('bitcoincash:qrvcdmgpk73zyfd8pmdl9wnuld36zh9n4gms8s0u59', 'bch');
    assert(res=='bitcoincash:qrvcdmgpk73zyfd8pmdl9wnuld36zh9n4gms8s0u59');
  });
  it('should keep the address if there is nothing to do (btc)', function() {
    var res = AddressTranslator.translate('1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA', 'btc');
    assert(res=='1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA');
  });
  it('should support 3 params NOK', function() {

    var a;
    try {
      var res = AddressTranslator.translate('1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA', 'btc', 'bch');
    } catch (e) {
      a=e.toString();
      assert(a.match(/Address has mismatched network type/));
    };
  });
  it('should support 3 params OK', function() {
    var res = AddressTranslator.translate('HBf8isgS8EXG1r3X6GP89FmooUmiJ42wHS', 'btc', 'bch');
    assert(res=='36q2G5FMGvJbPgAVEaiyAsFGmpkhPKwk2r');
  });

  it('should work with arrays also', function() {
    var res = AddressTranslator.translateOutput(['1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA', '37YHiaQnMjy73GS1UpiE8p2Ju6MyrrDw3J', '1DuPdCpGzVX73kBYaAbu5XDNDgE2Lza5Ed']);
    assert(res[0] == 'bitcoincash:qrvcdmgpk73zyfd8pmdl9wnuld36zh9n4gms8s0u59');
    assert(res[1] == 'bitcoincash:ppqz5v08kssnuupe0ckqtw4ss3qt460fcqugqzq2me');
    assert(res[2] == 'bitcoincash:qzxc5pnsfs8pmgfprhzc4l4vzf3zxz8p85nc6kfh8l');
  });


});


