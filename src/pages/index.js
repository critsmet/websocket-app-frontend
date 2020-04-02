import React, { useEffect, useState }from "react"

import socketIOClient from "socket.io-client";

import Layout from "../components/layout"
import Login from "../components/login"

let socket

const IndexPage = () => {

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => checkForLoggedInUser(), [])

  const checkForLoggedInUser = () => {
    const user = localStorage.getItem('websocketUser')
    if(user){
      console.log(`Yup, ${user}, you were already logged in`);
      loginUser(user)
    }
    console.log("Nope, nothing in localStorage. Please log in.");
  }

  const establishSocketAndListeners = (user) => {
    socket = socketIOClient("http://localhost:4001")

    socket.emit("login", user)

    socket.on("alreadyConnected", (data) => {
      console.log("From server: here are all the users already here", data)
      setUsers(data)
    })
    socket.on("newUser", (data) => {
      setUsers(prevState => {
        return [ ...prevState, data ]
    })
      console.log(`${data} just logged in`)
  })
    socket.on("userLogout", (data) => {
      console.log(`${data} just logged out`);
      setUsers(prevState => {
        return prevState.filter(user => user !== data)
      })
    })
  }

  const loginUser = (user) => {
    localStorage.setItem('websocketUser', user)
    console.log(user, "is now logged in officially");
    setUser(user)
    establishSocketAndListeners(user)
  }

  const renderUsers = () => {
    console.log("All the users in state", users);
    return users.length ? `Users: ${users.join(", ")}` : `No one is here but you, ${user}`
  }

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        {user === null ? <Login user={user} loginUser={loginUser}/> : renderUsers()}
      </div>
    </Layout>
  );
}

export default IndexPage
