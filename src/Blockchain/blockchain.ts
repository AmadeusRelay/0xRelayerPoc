import {ZeroEx, Order, SignedOrder, Token, TransactionReceiptWithDecodedLogs} from '0x.js';
import Web3 = require('web3');
import * as BigNumber from 'bignumber.js';
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

    public async transferZRXTo(address: string, amount: BigNumber.BigNumber): Promise<TransactionReceiptWithDecodedLogs> {
        const token : Token = await this.getToken('ZRX');
        const txHash : string = await this.zeroEx.token.transferAsync(token.address, this.web3.eth.coinbase, address, amount);
        return await this.zeroEx.awaitTransactionMinedAsync(txHash);
    }

    public async getBalance(address: string, symbol: string): Promise<BigNumber.BigNumber> {
        if (!_.isUndefined(symbol) && symbol !== '') {
            const token : Token = await this.getToken(symbol);
            return this.zeroEx.token.getBalanceAsync(token.address, address);
        }
        else {
            return this.web3.eth.getBalance(address);
        }
	}
	
	public async getSignedOrder(symbol: string): Promise<SignedOrder> {
		const token : Token = await this.getToken(symbol);
		const order : SignedOrder = {
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
			salt: ZeroEx.generatePseudoRandomSalt()
		};

		const orderHash = ZeroEx.getOrderHashHex(order);
		order.ecSignature = await this.zeroEx.signOrderHashAsync(orderHash, this.web3.eth.coinbase);
		return order as SignedOrder;
	}

	public async fillOrder(order: SignedOrder, takerAmount: BigNumber.BigNumber, takerAddress: string): Promise<string> {
		return this.zeroEx.exchange.fillOrderAsync(order, takerAmount, false, takerAddress);
	}
}