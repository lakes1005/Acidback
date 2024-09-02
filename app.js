const express = require("express");
const app = express();
const port = 3000;
const { Web3 } = require("web3");
const contractInfo = require("./constants.json");

const address = "0x911A7cACa8B3f70171a284182E9965A8756db386";
const privateKey =
  "0xab588034c89ee10f647db670dc1cc832cb288a44b88a2c4ed0231951b5b12c05";
const rpc =
  "https://subnets.avacloud.io/bb51f1aa-34c2-488b-8f9d-6c465300ef6c";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola Bogotá!");
});

app.get("/contract-info", async (req, res) => {
  const lucasNet = new Web3(rpc);
  const balanceLucas = await lucasNet.eth.getBalance(address);
  console.log({ balanceLucas });
  res.send({
    message: "Hola Bogotá...!",
    balanceLucas: Number(balanceLucas) / 10 ** 18,
  });
});

app.post("/transfer-native-token", async (req, res) => {
  const lucasNet = new Web3(rpc);
  const account = lucasNet.eth.accounts.wallet.add(privateKey);
  const tx = {
    from: account[0].address,
    to: req.body.receiver,
    value: lucasNet.utils.toWei(String(req.body.amount), "ether"),
  };
  const txReceipt = await lucasNet.eth.sendTransaction(tx);
  console.log("Tx hash:", txReceipt.transactionHash);
  console.log(txReceipt.transactionHash);
  res.send({
    message: "Ok",
    statusCode: 200,
    txHash: txReceipt.transactionHash,
  });
});

app.post("/tranfer-diamond", async (req, res) => {
  const data = req.body;
  const lucasNet = new Web3(rpc);
  const account = lucasNet.eth.accounts.wallet.add(privateKey);
  let diamonds = new lucasNet.eth.Contract(
    contractInfo.abi,
    contractInfo.address
  );
  const transferDiamond = await diamonds.methods
    .transfer(data.receiver, data.amount)
    .send({
      from: account[0].address,
    });

  res.send({
    message: "Ok",
    statusCode: 200,
    txHash: transferDiamond.transactionHash,
  });
});

app.post("/transfer", async (req, res) => {
  const data = req.body;
  const lucasNet = new Web3(rpc);
  const account = lucasNet.eth.accounts.wallet.add(privateKey);
  let diamonds = new lucasNet.eth.Contract(
    contractInfo.abi,
    contractInfo.address
  );
  const tx = {
    from: account[0].address,
    to: data.receiver,
    value: data.emeralds,
  };
  //   const gasEmeralds = await lucasNet.eth.estimateGas(tx);
  const txReceipt = await lucasNet.eth.sendTransaction(tx);
  const transferDiamond = await diamonds.methods
    .transfer(data.receiver, data.diamonds)
    .send({
      from: account[0].address,
    });
  //   const gasDiamond = await diamonds.methods
  //     .transfer(data.receiver, data.diamonds)
  //     .estimateGas();
  res.send({
    message: "Ok",
    statusCode: 200,
    txHashDiamond: transferDiamond.transactionHash,
    txHashEmeralds: txReceipt.transactionHash,
    // gasDiamond: Number(gasDiamond),
    // gasEmeralds: Number(gasEmeralds),
  });
});

const nftList = {
    pirita: "ipfs://QmUDT5VWZBgTFK2q1wCMS5FzHrHJ2r2vTKb5HRyVdx87ZS",
    piedra: "ipfs://QmcrdwaYevL8SDovJNFyJT1aTo3nR4ZoxsjFa8UdsAgTSv",
    esmeraldamenor: "ipfs://QmXnV4JgYkJAq24t8tBEPn1u8wBrgBw4dwWx1nhUszeJ9F",
    esmeraldaenig:"ipfs://QmWKmVUSqamPeXXxfxMAG59eKc2TWnbGp6FzGW8qvv9d9n",
    esmeraldaazul:"ipfs://QmRMfWf1x8y15ap7pgw2YctJGcE3yd6Bhu7uxNTGUh5Dma",
    esmeralda:"ipfs://QmZsoHR962VDRSg7FCtHzmrXqDwT8AQaUPm95bs2GtGcLc",
    cobre:"ipfs://QmVvag5TnnTQUm1dCFM55UntJrf4pdY6xPmLzfqdFT6AL6",
    carbon:"ipfs://QmYRJzvUHc5JkyUHXzRTef9m4koKe8WwVf23y3JuBrxy4C",
    calcita:"ipfs://QmNt1S3dnm2J7nUp4pnyGdaUvYUM5u3MZABvLrTar3P6F6",

}

app.post("/mint", async (req, res) => {
    const data = req.body;
    const lucasNet = new Web3(rpc);
    const account = lucasNet.eth.accounts.wallet.add(privateKey);
    let nftContract = new lucasNet.eth.Contract(
      contractInfo.abiERC721,
      contractInfo.addressERC721
    );
    const transferDiamond = await nftContract.methods
      .safeMint(data.receiver, nftList[data.id])
      .send({
        from: account[0].address,
      });
    res.send({
      message: "Ok",
      statusCode: 200,
      txHashDiamond: transferDiamond.transactionHash,
    });
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});