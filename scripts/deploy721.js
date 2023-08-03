// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  [owner] = await ethers.getSigners();3
  
  // deploy impl
  // const implc = await ethers.getContractFactory("ERC721SeaDropCloneable");
  // const impl = await implc.deploy();
  // await impl.deployed();

  // console.log("impl address is:", impl.address);

  // const sdc = await ethers.getContractFactory("EZDrop721");
  // const seadrop = await sdc.deploy(impl.address);
  // await seadrop.deployed();

  // console.log("deploy address is:", seadrop.address);

  
  const ts20c = await ethers.getContractFactory("TestERC20");
  const ts20 = await ts20c.deploy();
  await ts20.deployed();

  console.log("test20 address is:", ts20.address);


  process.exit();

  // const sdc = await ethers.getContractFactory("EZDrop721");
  // const seadrop = await sdc.attach(
  //   "0xD81d9B9412D6476444Fe604213b6D5aD0E5325Ef"
  // );

  privateMintPrice = ethers.utils.parseEther("0.001");
  publicMintPrice = ethers.utils.parseEther("0.001");

  privateDrop = {
    maxTotalMintableByWallet: 20,
    startTime: Math.round(Date.now() / 1000) - 100,
    endTime: Math.round(Date.now() / 1000) + 100,
    maxTokenSupplyForStage: 11,
    startMode: 1,
  };

  whiteList = {
    maxTotalMintableByWallet: 20,
    startTime: Math.round(Date.now() / 1000) - 100,
    endTime: Math.round(Date.now() / 1000) + 100,
    maxTokenSupplyForStage: 11,
    startMode: 0,
  };

  publicDrop = {
    maxTotalMintableByWallet: 12,
    maxTokenSupplyForStage: 11,
    startTime: Math.round(Date.now() / 1000) - 100000,
    endTime: Math.round(Date.now() / 1000) + 100000,
    startMode: 0,
  };

  multiConfigure = {
    maxSupply: 10,
    seaDropImpl: seadrop.address,
    publicDrop: publicDrop,
    privateDrop: privateDrop,
    whiteList: whiteList,
    creatorPayoutAddress: owner.address,
    provenanceHash: ethers.constants.HashZero,
    baseURI: "ipfs://xxxxxx",
    signer: owner.address,
  };

  const tx = await seadrop.initialize(
    "DDD",
    "D",
    privateMintPrice,
    publicMintPrice,
    "0x1182Cf7e64c56AD7305502Af865bB591c4Ffc6a1",
    multiConfigure
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
