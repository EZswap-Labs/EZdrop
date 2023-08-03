const { expect, util } = require("chai");
const { ethers } = require("hardhat");

describe("Seadrop1155 Test", () => {
  let seadrop;
  let impl;
  let ts20;
  let nftContractAddress = "0x30A441A9E424E7638723aa56d82297dd2cD27C41";
  let nftContract = '0x30A441A9E424E7638723aa56d82297dd2cD27C41';

  const mockAddress = "0x39Ef50bd29Ae125FE10C6a909E42e1C6a94Dde29";

  let user;

  beforeEach("beforeEach", async () => {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [mockAddress],
    });

    user = await ethers.provider.getSigner(mockAddress);

    // [user] = await ethers.getSigners();

    const implc = await ethers.getContractFactory("ERC1155SeaDropCloneable");
    impl = await implc.attach("0x93673B5c3804E8149A8487cB5FBf75cC6bc355d6");

    const sdc = await ethers.getContractFactory("EZDrop1155");
    seadrop = await sdc.attach("0xde58b0389C44C9C25087f6559a4A131FF598Db62");

    const ts20c = await ethers.getContractFactory("TestERC20");
    ts20 = await ts20c.attach("0xc2132d05d31c914a87c6611c10748aeb04b58e8f");
  });

  it("public mint ts20 with erc20", async () => {
    // seadrop owner update fee
    // await seadrop
    //   .connect(owner)
    //   .updateFee(
    //     nftContractAddress,
    //     2,
    //     owner.address,
    //     ethers.utils.parseEther("0.0005")
    //   );

    // user get public mint price
    let publicMintPrice = await seadrop.getPublicMintPrice(nftContractAddress);
    console.log("publicMintPrice:", publicMintPrice);
    let FeePrice = (await seadrop.getFee(nftContractAddress, 2))[1];
    let FeeReceiver = (await seadrop.getFee(nftContractAddress, 2))[0];
    let totalPrice = publicMintPrice.add(FeePrice);
    console.log("totalPrice:", totalPrice);


    // test fee receive
    let creator = await seadrop.getCreatorPayoutAddress(nftContractAddress);
    // mint before balance
    let creatorBalanceBefore = await ts20.balanceOf(creator)
    let feeReceiverBalanceBefore =await ts20.balanceOf(FeeReceiver)


    // user get erc20 and approve it to seaport
    // await ts20.connect(user).mint(totalPrice);
    await ts20
      .connect(user)
      .approve(seadrop.address, ethers.constants.MaxUint256);

    // process.exit();

    const tokenId = 1;

    // user public mint
    await seadrop
      .connect(user)
      .mintPublic(nftContractAddress, user._address, tokenId, 1);

    
    // mint after balance
    let creatorBalanceAfter = await ts20.balanceOf(creator)
    let feeReceiverBalanceAfter = await ts20.balanceOf(FeeReceiver)

    let creatorIncrease = creatorBalanceAfter.sub(creatorBalanceBefore)
    let feeReceiverIncrease = feeReceiverBalanceAfter.sub(feeReceiverBalanceBefore)



    expect(creatorIncrease).to.equal(publicMintPrice);
    expect(feeReceiverIncrease).to.equal(FeePrice);

    // // test nft receive
    // expect(await nftContract.balanceOf(minter.address, tokenId)).to.equal(1);
  });

  it.skip("airdrop", async () => {
    const tokenId = 0;
    let airdropParams = [
      {
        nftRecipient: airdrop1.address,
        tokenId: tokenId,
        quantity: 5,
      },
      {
        nftRecipient: airdrop2.address,
        tokenId: tokenId,
        quantity: 5,
      },
    ];

    await seadrop
      .connect(nftCreator)
      .airdrop(nftContractAddress, airdropParams);

    // test nft receive
    expect(await nftContract.balanceOf(airdrop1.address, tokenId)).to.equal(5);
    expect(await nftContract.balanceOf(airdrop2.address, tokenId)).to.equal(5);
  });

  it.skip("should withdraw erc20 from seadrop", async () => {
    let testBalance = ethers.utils.parseEther("100");

    await ts20.connect(minter).mint(testBalance);
    await ts20.connect(minter).transfer(seadrop.address, testBalance);

    expect(await ts20.balanceOf(seadrop.address)).to.equal(testBalance);

    await seadrop.connect(owner).withdrawERC20(ts20.address, owner.address);

    expect(await ts20.balanceOf(seadrop.address)).to.equal(0);
    expect(await ts20.balanceOf(owner.address)).to.equal(testBalance);
  });
});
