import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { ADDRESS_ZERO } from "../hardhat-helper-config";

const setupGovernanceContracts: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;

  const governanceToken = await ethers.getContract("GovernanceToken", deployer);
  const timelock = await ethers.getContract("Timelock", deployer);
  const governorContract = await ethers.getContract(
    "GovernorContract",
    deployer
  );

  log("Setting up governance roles...");
  const proposerRole = await timelock.PROPOSER_ROLE();
  const executorRole = await timelock.EXECUTOR_ROLE();
  const adminRole = await timelock.TIMELOCK_ADMIN_ROLE();

  const proposerTx = await timelock.grantRole(
    proposerRole,
    governorContract.address
  );
  await proposerTx.wait(1);

  const executorTx = await timelock.grantRole(executorRole, ADDRESS_ZERO);
  await executorTx.wait(1);

  const revokeTX = await timelock.revokeRole(adminRole, deployer);
  await revokeTX.wait(1);

  log(
    "04 - Successful roles setup. Deployer is no longer the admin of 'Timelock'."
  );
};

export default setupGovernanceContracts;

setupGovernanceContracts.tags = ["all", "setup"];
