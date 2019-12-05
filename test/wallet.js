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
const gateway = new Gateway();
const randomstring = require("randomstring");

(async () => {
    let address = randomstring.generate({
        length: 32,
        charset: 'alphabetic'
    });
    const wallet = new FileSystemWallet(walletPath.toString());
    await gateway.connect(connection, { wallet, identity: "admin", discovery: { "enabled": true, "asLocalhost": true } });

    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    const secret = await ca.register({ affiliation: 'org1', enrollmentID: address, role: 'client' }, adminIdentity);

    const enrollment = await ca.enroll({ enrollmentID: address, enrollmentSecret: secret });
    const userIdentity = await X509WalletMixin.createIdentity("Org1MSP", enrollment.certificate, enrollment.key.toBytes());
    await wallet.import(address, userIdentity);

})();
