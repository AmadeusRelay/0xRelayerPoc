import {ZeroEx, Order, SignedOrder, Token, TransactionReceiptWithDecodedLogs} from '0x.js';
import Web3 = require('web3');
import * as BigNumber from 'bignumber.js';
import * as _ from 'lodash';
import AddressInfo from '../addressInfo';
import {Utils} from '../util';
import * as moment from 'moment';

export default class Blockchain {
    private zeroEx: ZeroEx;
    private web3: Web3;

    public constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        this.zeroEx = new ZeroEx(this.web3.currentProvider);
    }

    public async getToken(symbol: string): Promise<Token> {
        return this.zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(symbol);
    }

    public async transferTo(fromAddress: string, toAddress: string, amount: BigNumber.BigNumber, symbol: string): Promise<TransactionReceiptWithDecodedLogs> {
        if (_.isUndefined(symbol)) {
            symbol = 'WETH';
        }
        const token : Token = await this.getToken(symbol);
        const txHash : string = await this.zeroEx.token.transferAsync(token.address, fromAddress, toAddress, amount);
        return this.zeroEx.awaitTransactionMinedAsync(txHash);
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
    
    public async setAllowance(address: string, symbol: string, amount: BigNumber.BigNumber): Promise<void> {
        const token : Token = await this.getToken(symbol);
        const txHash : string = await this.zeroEx.token.setProxyAllowanceAsync(token.address, address, amount);
        await this.zeroEx.awaitTransactionMinedAsync(txHash);
    }

    public async depositWeth(address: string, amount: BigNumber.BigNumber): Promise<void> {
        const txHash : string = await this.zeroEx.etherToken.depositAsync(amount, address);
        await this.zeroEx.awaitTransactionMinedAsync(txHash);
    }

    public async withdrawWeth(address: string, amount: BigNumber.BigNumber): Promise<void> {
        const txHash : string = await this.zeroEx.etherToken.withdrawAsync(amount, address);
        await this.zeroEx.awaitTransactionMinedAsync(txHash);
    }
	
	public async getSignedOrder(symbol: string): Promise<SignedOrder> {
        const token : Token = await this.getToken(symbol);
        const order : SignedOrder = {
			ecSignature: null,
			exchangeContractAddress: await this.zeroEx.exchange.getContractAddressAsync(),
			expirationUnixTimestampSec: Utils.toUnixTimestamp(moment().add(1, 'h')),
			feeRecipient: this.web3.eth.coinbase,
			maker: this.web3.eth.coinbase,
			makerFee: Utils.toBaseUnit(0),
			makerTokenAddress: token.address,
			makerTokenAmount: Utils.toBaseUnit(50),
			taker: '0x0000000000000000000000000000000000000000',
			takerFee: Utils.toBaseUnit(0),
			takerTokenAddress: await this.zeroEx.etherToken.getContractAddressAsync(),
			takerTokenAmount: Utils.toBaseUnit(1),
			salt: ZeroEx.generatePseudoRandomSalt()
		};

		const orderHash = ZeroEx.getOrderHashHex(order);
		order.ecSignature = await this.zeroEx.signOrderHashAsync(orderHash, this.web3.eth.coinbase);
		return order;
    }
    
    public async getCoinbase(symbol: string): Promise<AddressInfo> {
        return {
            address: this.web3.eth.coinbase,
            balance: await this.getBalance(this.web3.eth.coinbase, symbol)
        };
    }

	public async fillOrder(order: SignedOrder, takerAmount: BigNumber.BigNumber, takerAddress: string): Promise<TransactionReceiptWithDecodedLogs> {
        const txHash : string = await this.zeroEx.exchange.fillOrderAsync(order, takerAmount, false, takerAddress);
        return this.zeroEx.awaitTransactionMinedAsync(txHash);
	}
}