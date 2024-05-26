const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  
  [site_owner, chan_owner1, chan_owner2, chan_owner3, member] = await ethers.getSigners()
  const owners = [chan_owner1, chan_owner2, chan_owner3]
  const name = ["Mercedes", "Porsche", "Ferrari"]
  

  const Discord = await ethers.getContractFactory("Discord")
  const discord = await Discord.deploy("Discord", "DC")
  await discord.deployed()

  console.log(`Dicord contract deployed at the address: ${discord.address}\n`)

  for (var i=0; i<3; i++) {
    const transaction = await discord.connect(owners[i]).create_channel(name[i], tokens(5))
    await transaction.wait()

    console.log(`channel ${name[i]}`)
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});