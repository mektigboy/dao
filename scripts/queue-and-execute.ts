import {
  DESCRIPTION,
  developmentChains,
  FUNCTION,
  FUNCTION_ARGS,
  MINIMUM_DELAY,
} from "../hardhat-helper-config";
import { ethers, network } from "hardhat";
import { moveBlocks, moveTime } from "../helpers";

export async function queueAndExecute(
  functionToCall: string,
  args: number[],
  proposalDescription: string
) {
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(proposalDescription)
  );

  // Queue
  const governorContract = await ethers.getContract("GovernorContract");
  const queueTx = await governorContract.queue(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );

  await queueTx.wait(1);
  console.log("Queued...");

  if (developmentChains.includes(network.name)) {
    await moveTime(MINIMUM_DELAY + 1);
    await moveBlocks(1);
  }

  // Execute
  const executeTx = await governorContract.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );

  await executeTx.wait(1);
  console.log("Executed...");
  console.log(`Box value: ${await box.retrieve()}`);
}

queueAndExecute(FUNCTION, [FUNCTION_ARGS], DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error), process.exit(1);
  });
