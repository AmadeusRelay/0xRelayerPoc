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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("bignumber.js");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __webpack_require__(2);
const BigNumber = __webpack_require__(0);
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(3);
const logger = __webpack_require__(4);
const bodyParser = __webpack_require__(5);
const blockchain_1 = __webpack_require__(6);
const BigNumber = __webpack_require__(0);
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
            });
        });
        router.get('/api/v0/Address/transfer/:to/:amount', (req, res, next) => {
            const toAddress = req.params.to;
            const amount = new BigNumber(req.params.amount);
            new blockchain_1.default().transferZRXTo(toAddress, amount).then((receipt) => {
                res.json(receipt);
            });
        });
        router.get('/api/v0/Address/:address/balance/:symbol?', (req, res, next) => {
            const address = req.params.address;
            const symbol = req.params.symbol;
            new blockchain_1.default().getBalance(address, symbol).then((amount) => {
                res.type('text/plain');
                res.send(amount.toString());
            });
        });
        router.get('/api/v0/Trade/:symbol/:amount/:toAddress', (req, res, next) => {
            const symbol = req.params.symbol;
            const amount = new BigNumber(req.params.amount);
            const takerAddress = req.params.toAddress;
            new blockchain_1.default().getSignedOrder(symbol).then((order) => {
                new blockchain_1.default().fillOrder(order, amount, takerAddress).then((transactionHash) => {
                    const returned = order;
                    returned.tx = transactionHash;
                    res.json(returned);
                });
            });
        });
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello World 2!'
            });
        });
        this.express.use('/', router);
    }
}
exports.default = new App().express;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const _0x_js_1 = __webpack_require__(7);
const Web3 = __webpack_require__(8);
const BigNumber = __webpack_require__(0);
const _ = __webpack_require__(9);
class Blockchain {
    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        this.zeroEx = new _0x_js_1.ZeroEx(this.web3.currentProvider);
    }
    async getToken(symbol) {
        return await this.zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(symbol);
    }
    async transferZRXTo(address, amount) {
        const token = await this.getToken('ZRX');
        const txHash = await this.zeroEx.token.transferAsync(token.address, this.web3.eth.coinbase, address, amount);
        return await this.zeroEx.awaitTransactionMinedAsync(txHash);
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
    async getSignedOrder(symbol) {
        const token = await this.getToken(symbol);
        const order = {
            ecSignature: null,
            exchangeContractAddress: await this.zeroEx.exchange.getContractAddressAsync(),
            expirationUnixTimestampSec: new BigNumber(0),
            feeRecipient: this.web3.eth.coinbase,
            maker: this.web3.eth.coinbase,
            makerFee: new BigNumber('0'),
            makerTokenAddress: token.address,
            makerTokenAmount: await this.getBalance(token.address, symbol),
            taker: '0x0000000000000000000000000000000000000000',
            takerFee: new BigNumber('0'),
            takerTokenAddress: await this.zeroEx.etherToken.getContractAddressAsync(),
            takerTokenAmount: new BigNumber('1'),
            salt: _0x_js_1.ZeroEx.generatePseudoRandomSalt()
        };
        const orderHash = _0x_js_1.ZeroEx.getOrderHashHex(order);
        order.ecSignature = await this.zeroEx.signOrderHashAsync(orderHash, this.web3.eth.coinbase);
        return order;
    }
    async fillOrder(order, takerAmount, takerAddress) {
        return this.zeroEx.exchange.fillOrderAsync(order, takerAmount, false, takerAddress);
    }
}
exports.default = Blockchain;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("0x.js");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("web3");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map