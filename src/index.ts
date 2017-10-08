import {ZeroEx, Token as ZeroExToken} from '0x.js';
import Web3 = require('web3');

document.onreadystatechange = function() {
    let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    let zeroEx = new ZeroEx(web3.currentProvider);
    zeroEx.tokenRegistry.getTokensAsync().then(function(tokens) {
         tokens.forEach(element => {
             alert('Token '+ element.name + ' (' + element.symbol + ') with address ' + element.address);
         });
    });
}