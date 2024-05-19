import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import Discord from './abis/Discord.json'

// Config
import config from './config.json';

// Socket
const socket = io('ws://localhost:3030');

function App() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [discord, setDiscord] = useState(null)
  const [CHANNEL, setCHANNEL] = useState([])

  const loadBlockChainData = async() => {
    // here we are going to transform our application into a blockchain app by using ethers library (the same used in the smart contract)
    const provider = new ethers.providers.Web3Provider(window.ethereum) //window.ethereum is from metamask wallet
    setProvider(provider)
    // fetching the network
    const network = provider.getNetwork()
    // loading the smart contract
    const discord = new ethers.Contract(config[network.chainID].Discord.address, Discord, provider)
    setDiscord(discord)
    // loqding the chqnnels
    const total_channel = await discord.totalchannel()
    const CHANNEL = []
    for (var i=0; i<total_channel; i++) {
      const channel = await discord.channels(i)
      CHANNEL.push(channel)
    }
    setCHANNEL(CHANNEL)
    console.log(CHANNEL)
    // this function detect account wallet changement 
    window.ethereum.on('accountsChanged', async() => {
      window.location.reload()
    })
  }
  useEffect(() => {
    loadBlockChainData()
  }, [])
  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <main>

      </main>
    </div>
  );
}

export default App;
