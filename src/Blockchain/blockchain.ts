import {ZeroEx, Token, TransactionReceiptWithDecodedLogs} from '0x.js';
import Web3 = require('web3');
import {BigNumber} from 'bignumber.js';
import * as _ from 'lodash';

export default class Blockchain {
    private zeroEx: ZeroEx;
    private web3: Web3;

    public constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        this.zeroEx = new ZeroEx(this.web3.currentProvider);
    }

    public async getToken(symbol: string): Promise<Token> {
        return await this.zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(symbol);
    }

    public async transferZRXTo(address: string, amount: BigNumber): Promise<TransactionReceiptWithDecodedLogs> {
        const token : Token = await this.getToken('ZRX');
        const txHash : string = await this.zeroEx.token.transferAsync(token.address, this.web3.eth.coinbase, address, amount);
        return await this.zeroEx.awaitTransactionMinedAsync(txHash);
    }

    public async getBalance(address: string, symbol: string): Promise<BigNumber> {
        if (!_.isUndefined(symbol) && symbol !== '') {
            const token : Token = await this.getToken(symbol);
            return this.zeroEx.token.getBalanceAsync(token.address, address);
        }
        else {
            return this.web3.eth.getBalance(address);
        }
    }
}