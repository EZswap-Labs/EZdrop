
# EZDrop

EZDrop is a contract for conducting primary NFT drops on evm-compatible blockchains.

## Table of Contents

- [SeaDrop](#seadrop)
  - [Background](#Background)
  - [Install](#Install)
  - [Environment setting](#Environment-setting)
  - [Deploy](#Deploy)
  - [Run test](#Test)


## Background

EZDrop is a contract to perform primary drops on evm-compatible blockchains. The types of drops supported are public drops, private drops, air drops . An implementing token contract should contain the methods to interface with `EZDrop721` or `EZDrop1155` through an authorized user such as an Owner or Administrator. It supports both ERC721 and ERC1155 token, and payment supports both native token and ERC20 token.

## Install

To install dependencies and compile contracts:

```bash
git clone --recurse-submodules git@github.com:EZswap-Labs/EZdrop.git && cd seadrop
npm i
```

## Environment Setup

Rename .env.example to .env and edit the variables appropriately.

```bash
mv example.env .env
```

## Deploy

### deploy EZDrop contracts to Goerli network
```bash
npx hardhat run script/deploy721.js --network goerli
npx hardhat run script/deploy1155.js --network goerli
```

### deploy EZDrop contracts to Matic network
```bash
npx hardhat run script/deploy721.js --network matic
npx hardhat run script/deploy1155.js --network matic
```


## Test

### To run the EZDrop test script.

Test the functions of the `EZDrop721` and `EZDrop1155` contract.
```bash
npx hardhat test test/testSeadrop721.js
npx hardhat test test/testSeadrop1155.js
```

