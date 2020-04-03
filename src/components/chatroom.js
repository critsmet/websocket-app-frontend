import React, {useState} from 'react'

const ChatRoom = ({user, users, socket, messages, setMessages}) => {

  const [message, changeMessage] = useState("")

  const loggedInUsers = () => users.filter(user => user.socketId !== null)

  const renderUsers = () => {
    console.log("All the users in state", users);
    return loggedInUsers().length ? `You are in the chatroom with: ${loggedInUsers().map(user => user.username).join(", ")}` : `No one is here but you, ${user.username}`
  }

  const handleSend = () => {
    let messageObj = {id: user.id, message}
    socket.emit("sentMessage", message)
    setMessages(prevState => [...prevState, messageObj])
    changeMessage("")
  }

  return(
    <div id="chatroom">
      {renderUsers()}
      <div id="messages-container">
      </div>
      <div id="input-field">
        <input onChange={(e) => changeMessage(e.target.value)} value={message} placeholder="Say something..."/>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default ChatRoom
