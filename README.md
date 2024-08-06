# Retro Moment Contracts

Contract to recharge a slots to take photos which will be record on blockchain

## Run test

```shell
npx hardhat help

npx hardhat test

REPORT_GAS=true npx hardhat test

npx hardhat node


```

## Deploy

Steps to deploy correcty on Scroll network

```shell
npx hardhat ignition deploy ./ignition/modules/RetroMomentRoll.js --network scrollSepolia

npx npx hardhat verify --network scrollSepolia CONTRACT_ADDRESS CONSTRUCTOR_PARAMS
```
