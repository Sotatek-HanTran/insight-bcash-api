'use strict';

var request = require('request');

function CurrencyController(options) {
  this.node = options.node;
  var refresh = options.currencyRefresh || CurrencyController.DEFAULT_CURRENCY_DELAY;
  this.currencyDelay = refresh * 60000;
  this.bitstampRate = 0;
  this.timestamp = Date.now();
}

CurrencyController.DEFAULT_CURRENCY_DELAY = 10;

CurrencyController.prototype.index = function(req, res) {
  var self = this;
  var currentTime = Date.now();
  if (self.bitstampRate === 0 || currentTime >= (self.timestamp + self.currencyDelay)) {
    self.timestamp = currentTime;
    request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BSV&tsyms=USD', function(err, response, body) {
      try {
        if (err) {
          self.node.log.error(err);
        }
        if (!err && response.statusCode === 200) {
          var data = JSON.parse(body);
          if (data !== null && data.BSV.USD) {
            self.bitstampRate = parseFloat(data.BSV.USD);
          }
          else {
            self.node.log.error(new Error('Bad bsv-e response: missing ticker'));
          }
        res.jsonp({
          status: 200,
          data: {
            bitstamp: self.bitstampRate
          }
        });
        } else {
          res.jsonp({
            status: 200,
            data: {
              bitstamp: self.bitstampRate
            }
          });
        }
      }
      catch (err) {
        self.node.log.error(new Error(`Failed get bsv rates ${err}: `));
      }
    });
  }
}
module.exports = CurrencyController;
