const { expect } = require("chai");
const { ethers } = require("hardhat");

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
    console.log(ethers.utils.parseUnits('10', 'ether').toHexString())

  })
});
