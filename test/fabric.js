'use strict';
let connection = {
    "name": "local_fabric",
    "version": "1.0.0",
    "client": {
        "organization": "Org1",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300"
                },
                "orderer": "300"
            }
        }
    },
    "organizations": {
        "Org1": {
            "mspid": "Org1MSP",
            "peers": [
                "peer0.org1.example.com"
            ],
            "certificateAuthorities": [
                "ca.org1.example.com"
            ]
        }
    },
    "peers": {
        "peer0.org1.example.com": {
            "url": "grpc://localhost:17051"
        }
    },
    "certificateAuthorities": {
        "ca.org1.example.com": {
            "url": "http://localhost:17054",
            "caName": "ca.org1.example.com"
        }
    }
}
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const walletPath = path.join(process.cwd(), 'wallet');
(async () => {
    // Connect to Slack
    const wallet = new FileSystemWallet(walletPath.toString());

    const gateway = new Gateway();

    await gateway.connect(connection, { wallet, identity: "admin", discovery: { "enabled": true, "asLocalhost": true } });


    const network = await gateway.getNetwork('mychannel');

    const contract = await network.getContract('tokenContract17');
    let datas = {
        username : "ucing",
        password : "ucing"
    };
    let transfer = {
        sender : "admin",
        username : "ucing",
        password : "ucing",
        amount : "1"
    };
    let data = await contract.submitTransaction("init", "ucing");
    //let data = await contract.submitTransaction("createAccount", JSON.stringify(datas));
    //let data = await contract.submitTransaction("transfer", JSON.stringify(transfer));
   // let data = await contract.evaluateTransaction("getBalance", "ucing");
    let aa = Buffer.from(data);
    console.error(aa.toString())
})();
