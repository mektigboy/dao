import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} from "../hardhat-helper-config";

const deployGovernorContract: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;

  const governanceToken = await get("GovernanceToken");
  const timelock = await get("Timelock");

  const governorContract = await deploy("GovernorContract", {
    args: [
      governanceToken.address,
      timelock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ],
    from: deployer,
    log: true,
  });
  log(
    `03 - Deployed contract 'GovernorContract' at: ${governorContract.address}`
  );
};

export default deployGovernorContract;

deployGovernorContract.tags = ["all", "governor-contract"];
