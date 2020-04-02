import React, {useState} from 'react'

const Login = ({user, loginUser}) => {

  const [text, inputText] = useState('')

  if (user === null) {
    return (
      <div>
        Enter your name:
        <input onChange={(e => inputText(e.target.value))} type="text"/>
        <input onClick={(e) => loginUser(text)} type="button" value="Submit"/>
      </div>
    )

  } else {
    return (<React.Fragment></React.Fragment>)
  }
}

export default Login
