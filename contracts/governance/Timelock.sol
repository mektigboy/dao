// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract Timelock is TimelockController {
    constructor(
        uint256 minimumDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minimumDelay, proposers, executors) {}
}
