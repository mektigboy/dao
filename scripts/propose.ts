import {
  DESCRIPTION,
  developmentChains,
  FUNCTION,
  FUNCTION_ARGS,
  PROPOSAL_FILE,
  VOTING_DELAY,
} from "../hardhat-helper-config";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../helpers";
import * as fs from "fs";

export async function makeProposal(
  functionToCall: string,
  args: number[],
  proposalDescription: string
) {
  const governorContract = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  const proposeTx = await governorContract.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );

  const proposeReceipt = await proposeTx.wait(1);

  // Jump Time
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log("Proposal id: ", proposalId.toString());

  fs.writeFileSync(
    PROPOSAL_FILE,
    JSON.stringify({
      [network.config.chainId!.toString()]: [proposalId.toString()],
    })
  );
}

makeProposal(FUNCTION, [FUNCTION_ARGS], DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error), process.exit(1);
  });
