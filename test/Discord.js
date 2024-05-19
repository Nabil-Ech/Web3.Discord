const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Web3.discord", function () {
  let discord
  let result

  beforeEach(async() => {
    [site_owner, chan_owner, member] = await ethers.getSigners()

    const Discord = await ethers.getContractFactory("Discord")
    discord = await Discord.deploy("Discord", "DC")

    let transaction = await discord.connect(chan_owner).create_channel("testing", tokens(10))
    await transaction.wait()
  })

  describe("Deployment", () => {
    
    it("checks the name", async() => {
      result = await discord.name()
      expect(result).to.be.equal("Discord")
    })

    it("checks the symbol", async() => {
      result = await discord.symbol()
      expect(result).to.be.equal("DC")
    })

  })

  describe("Joining channel", () => {

    it("channel number", async() => {
      const channel = await discord.totalchannel()
      expect(channel).to.equal(1)
    })

    it("channel attributes", async() => {
      const channel = await discord.channels(1)
      expect(channel.name).to.be.equal("testing")
      expect(channel.id).to.be.equal(1)
      expect(channel.cost).to.be.equal(tokens(10))
    })

    it("channel owner", async() => {
      result = await discord.channel_owner(1)
      expect(result).to.be.equal(chan_owner.address)
    })
  })

  describe("joining channel", () => {
    beforeEach(async() => {
      const ID = 1
      const AMOUNT = ethers.utils.parseUnits("10", 'ether')
      result =  await discord.connect(member).join_channel(ID, { value: AMOUNT })
      await result.wait() 
    })
    it("has joined", async() => {
      let result = await discord.has_joined(1, member.address)
      expect(result).to.be.equal(true)
    })
    it("channel owner balance", async() => {
      result = await ethers.provider.getBalance(site_owner.address)
      console.log(result)
      // expect(result).to.equal(owner_money + tokens(2))
      
      result = await ethers.provider.getBalance(chan_owner.address)
      console.log(result)
      result = await ethers.provider.getBalance(discord.address)
      console.log(result)
      // expect(result).to.equal(tokens(0))
      result = await ethers.provider.getBalance(member.address)
      console.log(result)
      // expect(result).to.be.equal(true)
    })
    // it("has joined", async() => {
    //   let result = await discord.has_joined(1, member.address)
    //   expect(result).to.be.equal(true)
    // })

  })
})
