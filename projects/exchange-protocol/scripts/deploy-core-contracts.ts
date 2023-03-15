import { Contract } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
  const pancakeFactory = await PancakeFactory.deploy(process.env.DEV_ADDRESS);

  await pancakeFactory.deployed();

  console.log(
    `PancakeFactory with ${process.env.DEV_ADDRESS} recipient address deployed to ${pancakeFactory.address}`
  );

  const WrappedLibex = await ethers.getContractFactory("WETH9");
  const wrappedLibex = await WrappedLibex.deploy();

  await wrappedLibex.deployed();

  console.log(
    `WrappedLibex deployed to ${wrappedLibex.address}`
  );

  const PancakeRouter = await ethers.getContractFactory("PancakeRouter01");
  const pancakeRouter = await PancakeRouter.deploy(pancakeFactory.address, wrappedLibex.address);

  await pancakeRouter.deployed();

  console.log(
    `PancakeRouter with factory address ${pancakeFactory.address} and wrapped libex address ${wrappedLibex.address} deployed to ${pancakeRouter.address}`
  );

  const PancakeZapV1 = await ethers.getContractFactory("PancakeZapV1");
  const pancakeZap = await PancakeZapV1.deploy(wrappedLibex.address, pancakeRouter.address, 50);

  await pancakeZap.deployed();

  console.log(
    `PancakeZapV1 with wrapped libex address ${wrappedLibex.address} and router address ${pancakeRouter.address} deployed to ${pancakeZap.address}`
  );

  console.log('');
  console.log(`Factory:     ${pancakeFactory.address}`);
  console.log(`WLibex:      ${wrappedLibex.address}`);
  console.log(`Router:      ${pancakeRouter.address}`);
  console.log(`Zap:         ${pancakeZap.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
