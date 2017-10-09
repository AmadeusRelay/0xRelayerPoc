import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import Blockchain from './Blockchain/blockchain';
import {Token, TransactionReceiptWithDecodedLogs} from '0x.js';
import * as BigNumber from 'bignumber.js';

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
      });
    });
    router.get('/api/v0/Address/transfer/:to/:amount', (req, res, next) => {
      const toAddress: string = req.params.to;
      const amount: BigNumber.BigNumber = new BigNumber(req.params.amount);
      new Blockchain().transferZRXTo(toAddress, amount).then((receipt: TransactionReceiptWithDecodedLogs) => {
        res.json(receipt);
      });
    });
    router.get('/api/v0/Address/:address/balance/:symbol?', (req, res, next) => {
      const address: string = req.params.address;
      const symbol: string = req.params.symbol;
      new Blockchain().getBalance(address, symbol).then((amount: BigNumber.BigNumber) => {
        res.type('text/plain');
        res.send(amount.toString());
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

export default new App().express;