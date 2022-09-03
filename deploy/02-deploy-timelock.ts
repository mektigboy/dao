import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { EXECUTORS, MINIMUM_DELAY, PROPOSERS } from "../hardhat-helper-config";

const deployTimelock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying Timelock...");
  const timelock = await deploy("Timelock", {
    args: [MINIMUM_DELAY, PROPOSERS, EXECUTORS],
    from: deployer,
    log: true,
  });
  log(`02 - Deployed contract 'Timelock' at: ${timelock.address}`);
};

export default deployTimelock;

deployTimelock.tags = ["all", "timelock"];
