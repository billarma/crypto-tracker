const { ethers, Contract } = require('ethers');
const BigNumber = require('bignumber.js');
const fs = require('fs');

function formatTimestamp(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `[${hours}:${minutes}:${seconds}]`;
}

const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com/');

const contractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

const contractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];

const contract = new ethers.Contract(contractAddress, contractABI, provider)

const transferThreshold = 10000000000 //10,000 USDT (Minimum amount printed) 

const main = async () => {    
    const name = await new contract.name
    console.log(`Whale Tracker Started, Large Transactions of ${name}`)

    contract.on('Transfer', (from, to, amount, data) => {
        if(amount.toNumber() >= transferThreshold) {  
            const timestamp = formatTimestamp(new Date());
            
            console.log(`${timestamp} New Transaction: https://etherscan.io/tx/${data.transactionHash}`)
            const value = ethers.utils.parseUnits(`${amount}`, 0);
            const formattedValue = new BigNumber(ethers.utils.formatUnits(value, 6)).toFixed(0);

            function addCommas(formattedValue) {
                const parts = formattedValue.toString().split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return parts.join('.');
              }

            const formattedValueWithCommas = addCommas(formattedValue);
            console.log(`$${formattedValueWithCommas} - Confirmed`)
            
            fs.appendFile('transactions.txt', `${timestamp} Transaction: https://etherscan.io/tx/${data.transactionHash} - $${formattedValueWithCommas}\n`, (err) => {
                if (err) {
                  console.error('Error writing to file:', err);
                  return;
                }
            })
        }
    })
}

main()
