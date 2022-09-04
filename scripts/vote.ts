import {
  developmentChains,
  PROPOSAL_FILE,
  VOTING_PERIOD,
} from "../hardhat-helper-config";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../helpers";
import * as fs from "fs";

const VOTE_NO = 0;
const VOTE_YES = 1;
const VOTE_ABSTAIN = 2;

export async function vote(proposalId: string) {
  console.log("Voting...");

  const governorContract = await ethers.getContract("GovernorContract");
  const voteTx = await governorContract.castVoteWithReason(
    proposalId,
    VOTE_YES,
    "Just because."
  );

  await voteTx.wait(1);

  let proposalState = await governorContract.state(proposalId);
  console.log("Proposal state before voting: ", proposalState);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }

  proposalState = await governorContract.state(proposalId);
  console.log("Proposal state after voting: ", proposalState);
}

const proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"));
const proposalId = proposals[network.config.chainId!][0];
vote(proposalId)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error), process.exit(1);
  });
