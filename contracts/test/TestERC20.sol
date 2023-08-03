// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ERC20} from "solmate/tokens/ERC20.sol";

contract TestERC20 is ERC20("Test20", "TS20", 18) {
    function mint(uint amount) external {
        _mint(msg.sender, amount);
    }
}
