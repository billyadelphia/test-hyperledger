'use strict';

//import Hyperledger Fabric 1.4 SDK
const {Contract} = require('fabric-contract-api');

const TOTAL_SUPPLY = 9000;

class TokenContract extends Contract {

    constructor(){
        super('TokenContract');
    }

    async init(ctx, args) {
        console.log('instantiate was called!', args);
        if (!await this.checkUsername(ctx, "admin")) {
            let total = await ctx.stub.putState("TOTAL_SUPPLY", Buffer.from(TOTAL_SUPPLY.toString()));
            console.log("total", total);
            let adminAccount = {
                username: "admin",
                password: args || "1234"
            };
            await this.createAccount(ctx, JSON.stringify(adminAccount));
            let balance = {
                balance: TOTAL_SUPPLY
            };
            await ctx.stub.putState("admin", Buffer.from(JSON.stringify(balance)));
            return TOTAL_SUPPLY.toString();
        } else {
            throw new Error( "admin is already exist!");
        }

    }

    async transfer(ctx, args) {
        args = JSON.parse(args);
        let sender = args.sender;
        let recipient = args.recipient;
        let sender_password = args.password;
        let amount = args.amount;

        if (await this.checkUsername(ctx, recipient)) {

           let password = await ctx.stub.getPrivateData("collectionMarbles", sender);
           if (sender_password === password.toString()) {

                let senderBalance = await this.getBalance(ctx, sender);
                let recipientBalance = await this.getBalance(ctx, recipient);
                if(senderBalance > 0 && senderBalance >= amount){
                    let sender_balance = {
                        balance: senderBalance - amount
                    };
                    await ctx.stub.putState(sender, Buffer.from(JSON.stringify(sender_balance)));
                    let recipient_balance = {
                        balance: recipientBalance + amount
                    };
                    await ctx.stub.putState(recipient, Buffer.from(JSON.stringify(recipient_balance)));
                    return `${amount} Coin sent to ${recipient} from ${sender}`;
                }else {
                    throw new Error(`sender balance is ${senderBalance}`)
                }
            } else {
               throw new Error("password is wrong !")
            }

        } else {
            throw new Error("recipient not found!")
        }

    }

    async getBalance(ctx, username) {
        let data = await ctx.stub.getState(username);
        if(!!data && data.length > 0){
            data = JSON.parse(data.toString());
            return data.balance * 1;
        }else{
            return 0;
        }

    }

    async checkUsername(ctx, username) {
        let checkUsername = await ctx.stub.getState(username);
        return !!checkUsername && checkUsername.length > 0
    }

    async getTotalSupply(ctx) {
        let supply = await ctx.stub.getState("TOTAL_SUPPLY");
        return supply.toString();
    }

    async createAccount(ctx, args) {
        args = JSON.parse(args);
        let username = args.username;
        let password = args.password;

        if (await this.checkUsername(ctx, username)) {
            throw new Error("username is already exist!")
        } else {
            let balance = {
                balance: 0
            };
            await ctx.stub.putState(username, Buffer.from(JSON.stringify(balance)));
            await ctx.stub.putPrivateData("collectionMarbles", username, Buffer.from(password.toString()));
            return `${username} is registered`
        }

    }

}

module.exports = TokenContract;