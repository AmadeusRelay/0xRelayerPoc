import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import Blockchain from './Blockchain/blockchain';
import {SignedOrder, Token, TransactionReceiptWithDecodedLogs} from '0x.js';
import * as BigNumber from 'bignumber.js';
import AddressInfo from './addressInfo';
import { Utils } from './util';
import * as _ from 'lodash';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    router.get('/api/v0/Token/:symbol', (req, res, next) => {
      const symbol: string = req.params.symbol;
      new Blockchain().getToken(symbol).then((token: Token) => {
        res.type('text/plain');
        res.send(`Token ${token.name} (${token.symbol}) found at address ${token.address}`);
      }).catch(next);
    });
    router.get('/api/v0/Address/:from/transfer/:to/:amountInUnits/:symbol?', (req, res, next) => {
      const fromAddress: string = req.params.from;
      const toAddress: string = req.params.to;
      const amount: BigNumber.BigNumber = Utils.toBaseUnit(req.params.amountInUnits);
      const symbol: string = req.params.symbol;
      new Blockchain().transferTo(fromAddress, toAddress, amount, symbol).then((receipt: TransactionReceiptWithDecodedLogs) => {
        res.json(receipt);
      }).catch(next);
    });
    router.get('/api/v0/Address/:address/balance/:symbol?', (req, res, next) => {
      const address: string = req.params.address;
      const symbol: string = req.params.symbol;
      new Blockchain().getBalance(address, symbol).then((amount: BigNumber.BigNumber) => {
        res.type('text/plain');
        res.send(amount.toString());
      }).catch(next);
    });
    router.get('/api/v0/Address/:address/allowance/:symbol/:amountInUnits?', (req, res, next) => {
      const address: string = req.params.address;
      const symbol: string = req.params.symbol;
      let amount: BigNumber.BigNumber = Utils.toBaseUnit(0);
      if (!_.isUndefined(req.params.amountInUnits)) {
        amount = Utils.toBaseUnit(req.params.amountInUnits);
      }
      new Blockchain().setAllowance(address, symbol, amount).then(() => {
        res.type('text/plain');
        res.send('Sucesso');
      }).catch(next);
    });
    router.get('/api/v0/Address/:address/deposit/:amountInUnits', (req, res, next) => {
      const address: string = req.params.address;
      let amount: BigNumber.BigNumber = Utils.toBaseUnit(req.params.amountInUnits);
      new Blockchain().depositWeth(address, amount).then(() => {
        res.type('text/plain');
        res.send('Sucesso');
      }).catch(next);
    });
    router.get('/api/v0/Address/:address/withdraw/:amountInUnits', (req, res, next) => {
      const address: string = req.params.address;
      let amount: BigNumber.BigNumber = Utils.toBaseUnit(req.params.amountInUnits);
      new Blockchain().withdrawWeth(address, amount).then(() => {
        res.type('text/plain');
        res.send('Sucesso');
      }).catch(next);
    });
    router.get('/api/v0/Trade/:symbol/:amountInUnits/:toAddress', (req, res, next) => {
      const symbol: string = req.params.symbol;
      const amount: BigNumber.BigNumber = Utils.toBaseUnit(req.params.amountInUnits);
      const takerAddress: string = req.params.toAddress;
      new Blockchain().getSignedOrder(symbol).then((order: SignedOrder) => {
        new Blockchain().fillOrder(order, amount, takerAddress).then((transaction : TransactionReceiptWithDecodedLogs) => {
          res.json(transaction);
        }).catch(next);
      }).catch(next);
    });
    router.get('/api/v0/Coinbase/:symbol?', (req, res, next) => {
      const symbol: string = req.params.symbol;
      new Blockchain().getCoinbase(symbol).then((address: AddressInfo) => {
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
    this.express.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(err.status || 500);
      res.json({
          message: err.message,
          error: err
      });
    });
  }

}

export default new App().express;