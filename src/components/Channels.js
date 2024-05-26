const Channels = ({ provider, account, discord, channels, currentChannel, setCurrentChannel }) => {

  const channelHandler = async(channel) => {
    const hasJoined = await discord.has_joined(channel.id, account)
    if (hasJoined) {
      setCurrentChannel(channel)
    } else {
      const signer = await provider.getSigner()
      const join = await discord.connect(signer).join_channel(channel.id, { value : channel.cost})
      await join.wait()
      setCurrentChannel(channel)
    }

  }

  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>

      </div>
      <ul>
        {channels.map((channel, index) => (
          <li key={index} 
          onClick={() => channelHandler(channel)}
          className={currentChannel && currentChannel.id.toString() === channel.id.toString() ? "active" : ""}>  
          {channel.name} </li>
        ))}
      </ul>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Channels;