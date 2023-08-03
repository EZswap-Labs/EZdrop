const { expect, util } = require("chai");
const { ethers } = require("hardhat");

describe("Seadrop1155 Test", () => {
  let seadrop;
  let ts20;
  let nftContractAddress;
  let nftContract;

  let impl

  beforeEach("beforeEach", async () => {
    [owner, nftCreator, minter,airdrop1,airdrop2] = await ethers.getSigners();

    const implc = await ethers.getContractFactory("ERC1155SeaDropCloneable")
    impl = await implc.deploy()
    await impl.deployed()

    const sdc = await ethers.getContractFactory("EZDrop1155");
    seadrop = await sdc.deploy(impl.address);
    await seadrop.deployed();

    const ts20c = await ethers.getContractFactory("TestERC20");
    ts20 = await ts20c.deploy();
    await ts20.deployed();

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
      creatorPayoutAddress: nftCreator.address,
      signer: nftCreator.address,
    };



    const uri = "test1155uriiiiiiiiiii"

    const tx = await seadrop
      .connect(nftCreator)
      .initialize(
        uri,
        "AAA",
        privateMintPrice,
        publicMintPrice,
        ts20.address,
        multiConfigure
      );

    const initTx = await tx.wait();
    nftContractAddress = initTx.events.filter(
      (item) => item.event == "ERC1155SeaDropCreated"
    )[0].args[0];

    let nsc = await ethers.getContractFactory("ERC1155SeaDropCloneable");
    nftContract = nsc.attach(nftContractAddress);
  });


  it("public mint ts20 with erc20", async () => {
    // seadrop owner update fee
    await seadrop
      .connect(owner)
      .updateFee(
        nftContractAddress,
        2,
        owner.address,
        ethers.utils.parseEther("0.0005")
      );

    // user get public mint price
    let publicMintPrice = await seadrop.getPublicMintPrice(nftContractAddress);
    let FeePrice = (await seadrop.getFee(nftContractAddress, 2))[1];
    let FeeReceiver = (await seadrop.getFee(nftContractAddress, 2))[0];
    let totalPrice = publicMintPrice.add(FeePrice);

    // user get erc20 and approve it to seaport
    await ts20.connect(minter).mint(totalPrice);
    await ts20
      .connect(minter)
      .approve(seadrop.address, ethers.constants.MaxUint256);


    const tokenId = 1

    // user public mint
    await seadrop
      .connect(minter)
      .mintPublic(nftContractAddress, minter.address, tokenId , 1);

    // test fee receive
    let creator = await seadrop.getCreatorPayoutAddress(nftContractAddress);
    expect(await ts20.balanceOf(creator)).to.equal(publicMintPrice);
    expect(await ts20.balanceOf(FeeReceiver)).to.equal(FeePrice);

    // test nft receive
    expect(await nftContract.balanceOf(minter.address, tokenId)).to.equal(1);
  });

  it("airdrop", async () => {

    const tokenId = 1
    let airdropParams = [{
      nftRecipient: airdrop1.address,
      tokenId: tokenId,
      quantity: 5
    },
    {
      nftRecipient: airdrop2.address,
      tokenId: tokenId,
      quantity: 5
    }]

    await seadrop.connect(nftCreator).airdrop(nftContractAddress ,airdropParams)

    // test nft receive
    expect(await nftContract.balanceOf(airdrop1.address, tokenId)).to.equal(5);
    expect(await nftContract.balanceOf(airdrop2.address, tokenId)).to.equal(5);
  });

  it("should withdraw erc20 from seadrop", async () => {
    let testBalance = ethers.utils.parseEther("100");

    await ts20.connect(minter).mint(testBalance);
    await ts20.connect(minter).transfer(seadrop.address, testBalance);

    expect(await ts20.balanceOf(seadrop.address)).to.equal(testBalance);

    await seadrop.connect(owner).withdrawERC20(ts20.address, owner.address);

    expect(await ts20.balanceOf(seadrop.address)).to.equal(0);
    expect(await ts20.balanceOf(owner.address)).to.equal(testBalance);
  });
});


