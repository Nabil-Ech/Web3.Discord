const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  [site_owner, chan_owner1, chan_owner2, chan_owner3, member] = await ethers.getSigners()

  const Discord = await ethers.getContractFactory("Discord")
  const discord = await Discord.deploy("Discord", "DC")
  await discord.deployed()

  console.log(`Dicord contract deployed at the address: ${discord.address}\n`)

  let transaction = await discord.connect(chan_owner1).create_channel("channel1", tokens(5))
  await transaction.wait()
  transaction = await discord.connect(chan_owner2).create_channel("channel2", tokens(5))
  await transaction.wait()
  transaction = await discord.connect(chan_owner3).create_channel("channel3", tokens(5))
  await transaction.wait()

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});