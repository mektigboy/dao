import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;

  log("Deploying Box...");

  const box = await deploy("Box", {
    args: [],
    from: deployer,
    log: true,
  });

  const boxContract = await ethers.getContractAt("Box", box.address);
  const timelock = await ethers.getContract("Timelock");

  const transferTx = await boxContract.transferOwnership(timelock.address);
  await transferTx.wait(1);

  log("05 - Ownership of 'Box' contract is transferred to 'Timelock'.");
};

export default deployBox;

deployBox.tags = ["all", "box"];
