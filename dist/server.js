/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BigNumber = __webpack_require__(2);
const _ = __webpack_require__(0);
exports.Utils = {
    toUnixTimestamp(date) {
        return new BigNumber(date.unix());
    },
    toBaseUnit(unit) {
        return exports.Utils.toBaseUnitWithDecimals(unit, undefined);
    },
    toBaseUnitWithDecimals(unit, decimals) {
        if (_.isUndefined(decimals) || !_.isNumber(decimals)) {
            decimals = 18;
        }
        const toUnit = new BigNumber(10).pow(decimals);
        const baseUnitAmount = new BigNumber(unit).times(toUnit);
        return baseUnitAmount;
    }
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("bignumber.js");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __webpack_require__(4);
const BigNumber = __webpack_require__(2);
const port = process.env.PORT || 3000;
BigNumber.config({
    EXPONENTIAL_AT: 1000
});
App_1.default.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`server is listening on ${port}`);
});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(5);
const logger = __webpack_require__(6);
const bodyParser = __webpack_require__(7);
const blockchain_1 = __webpack_require__(8);
const util_1 = __webpack_require__(1);
const _ = __webpack_require__(0);
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints.
    routes() {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();
        router.get('/api/v0/Token/:symbol', (req, res, next) => {
            const symbol = req.params.symbol;
            new blockchain_1.default().getToken(symbol).then((token) => {
                res.type('text/plain');
                res.send(`Token ${token.name} (${token.symbol}) found at address ${token.address}`);
            }).catch(next);
        });
        router.get('/api/v0/Address/:from/transfer/:to/:amountInUnits/:symbol?', (req, res, next) => {
            const fromAddress = req.params.from;
            const toAddress = req.params.to;
            const amount = util_1.Utils.toBaseUnit(req.params.amountInUnits);
            const symbol = req.params.symbol;
            new blockchain_1.default().transferTo(fromAddress, toAddress, amount, symbol).then((receipt) => {
                res.json(receipt);
            }).catch(next);
        });
        router.get('/api/v0/Address/:address/balance/:symbol?', (req, res, next) => {
            const address = req.params.address;
            const symbol = req.params.symbol;
            new blockchain_1.default().getBalance(address, symbol).then((amount) => {
                res.type('text/plain');
                res.send(amount.toString());
            }).catch(next);
        });
        router.get('/api/v0/Address/:address/allowance/:symbol/:amountInUnits?', (req, res, next) => {
            const address = req.params.address;
            const symbol = req.params.symbol;
            let amount = util_1.Utils.toBaseUnit(0);
            if (!_.isUndefined(req.params.amountInUnits)) {
                amount = util_1.Utils.toBaseUnit(req.params.amountInUnits);
            }
            new blockchain_1.default().setAllowance(address, symbol, amount).then(() => {
                res.type('text/plain');
                res.send('Sucesso');
            }).catch(next);
        });
        router.get('/api/v0/Address/:address/deposit/:amountInUnits', (req, res, next) => {
            const address = req.params.address;
            let amount = util_1.Utils.toBaseUnit(req.params.amountInUnits);
            new blockchain_1.default().depositWeth(address, amount).then(() => {
                res.type('text/plain');
                res.send('Sucesso');
            }).catch(next);
        });
        router.get('/api/v0/Address/:address/withdraw/:amountInUnits', (req, res, next) => {
            const address = req.params.address;
            let amount = util_1.Utils.toBaseUnit(req.params.amountInUnits);
            new blockchain_1.default().withdrawWeth(address, amount).then(() => {
                res.type('text/plain');
                res.send('Sucesso');
            }).catch(next);
        });
        router.get('/api/v0/Trade/:symbol/:amountInUnits/:toAddress', (req, res, next) => {
            const symbol = req.params.symbol;
            const amount = util_1.Utils.toBaseUnit(req.params.amountInUnits);
            const takerAddress = req.params.toAddress;
            new blockchain_1.default().getSignedOrder(symbol).then((order) => {
                new blockchain_1.default().fillOrder(order, amount, takerAddress).then((transaction) => {
                    res.json(transaction);
                }).catch(next);
            }).catch(next);
        });
        router.get('/api/v0/Coinbase/:symbol?', (req, res, next) => {
            const symbol = req.params.symbol;
            new blockchain_1.default().getCoinbase(symbol).then((address) => {
                res.json(address);
            }).catch(next);
        });
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
        this.express.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err
            });
        });
    }
}
exports.default = new App().express;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const _0x_js_1 = __webpack_require__(9);
const Web3 = __webpack_require__(10);
const _ = __webpack_require__(0);
const util_1 = __webpack_require__(1);
const moment = __webpack_require__(11);
class Blockchain {
    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        this.zeroEx = new _0x_js_1.ZeroEx(this.web3.currentProvider);
    }
    async getToken(symbol) {
        return this.zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(symbol);
    }
    async transferTo(fromAddress, toAddress, amount, symbol) {
        if (_.isUndefined(symbol)) {
            symbol = 'WETH';
        }
        const token = await this.getToken(symbol);
        const txHash = await this.zeroEx.token.transferAsync(token.address, fromAddress, toAddress, amount);
        return this.zeroEx.awaitTransactionMinedAsync(txHash);
    }
    async getBalance(address, symbol) {
        if (!_.isUndefined(symbol) && symbol !== '') {
            const token = await this.getToken(symbol);
            return this.zeroEx.token.getBalanceAsync(token.address, address);
        }
        else {
            return this.web3.eth.getBalance(address);
        }
    }
    async setAllowance(address, symbol, amount) {
        const token = await this.getToken(symbol);
        const txHash = await this.zeroEx.token.setProxyAllowanceAsync(token.address, address, amount);
        await this.zeroEx.awaitTransactionMinedAsync(txHash);
    }
    async depositWeth(address, amount) {
        const txHash = await this.zeroEx.etherToken.depositAsync(amount, address);
        await this.zeroEx.awaitTransactionMinedAsync(txHash);
    }
    async withdrawWeth(address, amount) {
        const txHash = await this.zeroEx.etherToken.withdrawAsync(amount, address);
        await this.zeroEx.awaitTransactionMinedAsync(txHash);
    }
    async getSignedOrder(symbol) {
        const token = await this.getToken(symbol);
        const order = {
            ecSignature: null,
            exchangeContractAddress: await this.zeroEx.exchange.getContractAddressAsync(),
            expirationUnixTimestampSec: util_1.Utils.toUnixTimestamp(moment().add(1, 'h')),
            feeRecipient: this.web3.eth.coinbase,
            maker: this.web3.eth.coinbase,
            makerFee: util_1.Utils.toBaseUnit(0),
            makerTokenAddress: token.address,
            makerTokenAmount: util_1.Utils.toBaseUnit(50),
            taker: '0x0000000000000000000000000000000000000000',
            takerFee: util_1.Utils.toBaseUnit(0),
            takerTokenAddress: await this.zeroEx.etherToken.getContractAddressAsync(),
            takerTokenAmount: util_1.Utils.toBaseUnit(1),
            salt: _0x_js_1.ZeroEx.generatePseudoRandomSalt()
        };
        const orderHash = _0x_js_1.ZeroEx.getOrderHashHex(order);
        order.ecSignature = await this.zeroEx.signOrderHashAsync(orderHash, this.web3.eth.coinbase);
        return order;
    }
    async getCoinbase(symbol) {
        return {
            address: this.web3.eth.coinbase,
            balance: await this.getBalance(this.web3.eth.coinbase, symbol)
        };
    }
    async fillOrder(order, takerAmount, takerAddress) {
        const txHash = await this.zeroEx.exchange.fillOrderAsync(order, takerAmount, false, takerAddress);
        return this.zeroEx.awaitTransactionMinedAsync(txHash);
    }
}
exports.default = Blockchain;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("0x.js");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("web3");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map