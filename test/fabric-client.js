import {ConfigSignature, Orderer, TransactionId} from "fabric-client";

const Client = require("fabric-client");
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
};
const client = new Client();

(async () => {

      await client.loadFromConfig(connection);

      let channelRequest = {
          name: "testChannel",
          orderer: "mychannel",
          txId: "TransactionId",
          signatures: ""
      };

      let createChannel = await client.createChannel();
})();

