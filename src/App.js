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
  const [messages, setMessages] = useState([])
  const [currentChannel, setCurrentChannel] = useState(null)
  const [chan, setCHANNEL] = useState([])

  const loadBlockChainData = async() => {
    // here we are going to transform our application into a blockchain app by using ethers library (the same used in the smart contract)
    const provider = new ethers.providers.Web3Provider(window.ethereum) //window.ethereum is from metamask wallet
    setProvider(provider)
    // fetching the network
    const network = await provider.getNetwork()
    // loading the smart contract
    const discord = new ethers.Contract(config[network.chainId].Discord.address, Discord, provider)
    setDiscord(discord)
    // loqding the chqnnels
    const total_channel = await discord.totalchannel()
    // console.log(total_channel)
    const CHANNEL = []
    for (var i=1; i<=total_channel; i++) {
      const channel = await discord.channels(i)
      chan.push(channel)
      console.log(discord.channels(i))
    }
    setCHANNEL(chan)
    console.log(chan)
    // this function detect account wallet changement 
    window.ethereum.on('accountsChanged', async() => {
      window.location.reload()
    })
  }
  // get trigered whenever the page get refreshed 
  useEffect(() => {
    loadBlockChainData()

    socket.on("connect", () => {
      socket.emit('get messages')
    })

    socket.on('new message', (messages) => {
      setMessages(messages)
    })

    socket.on('get messages', (messages) => {
      setMessages(messages)
    })

    

    return () => {
      socket.off('connect')
      socket.off('new message')
      socket.off('get messages')
    }

    


  }, [])
  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <main>
        <Servers />
        <Channels
          provider={provider}
          account={account}
          discord={discord}
          channels={chan}
          setCurrentChannel={setCurrentChannel}
          currentChannel={currentChannel}
        />
        <Messages 
          account={account}
          messages={messages}
          currentChannel={currentChannel}
        />
      </main>
    </div>
  );
}

export default App;
