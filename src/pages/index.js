import React, { useEffect, useState }from "react"

import socketIOClient from "socket.io-client";

import Layout from "../components/layout"
import Login from "../components/login"
import ChatRoom from "../components/chatroom"

let socket

const IndexPage = () => {

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => checkForLoggedInUser(), [])

  const checkForLoggedInUser = () => {
    const loginId = localStorage.getItem('websocketUserId')
    if(loginId){
      console.log(`Yup, a user with the ID of ${loginId} was already logged in`);
      loginUser(parseInt(loginId))
    } else {
      console.log("Nope, nothing in localStorage. Please log in.");
    }
  }

  const loginUser = (loginId) => {
    //doesn't reset localStorage if already set
    establishConnection()
    emitLogin(loginId)
  }

  const signupUser = (username) => {
    establishConnection()
    emitSignup(username)
  }

  const establishConnection = () => {
    socket = socketIOClient("http://localhost:4001")
    console.log("establishing connection!!");
    addListeners()
  }

  const emitSignup = (username) => {
    socket.emit("signup", username)
  }

  const emitLogin = (loginId) => {
    socket.emit("login", loginId)
  }

  const addListeners = () => {
    socket.on("successfulLogin", userObj => {
      //no need to set the localStorage here as that's where we derived the original ID from
      setUser(userObj)
      console.log(`Yay! ${userObj.username} has logged back in!`);
    })
    socket.on("successfulSignup", userObj => {
      //set user to local storage
      localStorage.setItem('websocketUserId', userObj.id)
      setUser(userObj)
      console.log(`Woo! ${userObj.username} has signed up!`)
    })
    socket.on("allUsers", usersArray => {
      setUsers(usersArray)
      console.log("From server: here are all these users have already signed up", usersArray.map(user => user.username))
    })
    socket.on("newUser", userObj => {
      setUsers(prevState => {
        return [ ...prevState, userObj ]
      })
      console.log(`${userObj.username} just signed up`)
    })
    socket.on("newLogin", userObj => {
      console.log(`${userObj.username} just logged in`);
      setUsers(prevState => {
        return prevState.map(user => user.id !== userObj.id ? user : {...user, socketId: userObj.socketId})
      })
    })
    //we could get away with just receiving the userId or socketId here, but for consistency we'll receive the userObj
    socket.on("userLogout", userObj => {
      console.log(`${userObj.username} just logged out`);
      setUsers(prevState => {
        return prevState.map(user => user.id !== userObj.id ? user : {...user, socketId: null})
      })
    })
  }


  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        {user === null && <Login signupUser={signupUser}/>}
        {user !== null && <ChatRoom user={user} users={users} messages={messages} setMessages={setMessages} socket={socket}/>}
      </div>
    </Layout>
  );
}

export default IndexPage
