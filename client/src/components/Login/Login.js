import React, { useState, useContext } from 'react';
import './Login.css';
import { GlobalContext } from '../../context'
import Signup from '../signup/signup';

// Moved fetch request to inside the Login(). This sends the username and password as json to localhost:8080/login to get authenticated
export default function Login() {
  const context = useContext(GlobalContext)

  const [email, setUserName] = useState();
  const [password, setPassword] = useState();
  const [ showSignup, setShowSignup ] = useState(false)

  const handleSubmit = (e) => {
    // Added 'e' parameter so that i can use e.preventDefault() since before I was getting page reload errors when trying to use fetch, this helps prevent it
    e.preventDefault();
    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('error when submitting data', { cause: response })
        }
      })
      .then(data => {
        context.updateUserData(data.email, data.token, Boolean(data.isAdmin))
        sessionStorage.setItem('token', JSON.stringify(data.token));
      })
      .catch((err) => {
        console.error('handleSubmit', err)
      })
   }

  return(
    <> 
    <div>
      {showSignup ? (
        <Signup />
      ):(
      <div className="login-wrapper">
        <h1>SIGN IN </h1>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              <p>Email</p>
              <input type="text" onChange={e => setUserName(e.target.value)} />
            </label>
            <label>
              <p>Password</p>
              <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <div className="submit-button">
              <button type="submit">SIGN IN</button>
            </div>
            <p class="mt-4">New User? <button class="create-Link" onClick={()=> setShowSignup(true)}>Sign Up</button ></p>
            {/* <p>Forgot Password? <a href="/forgot">Reset</a></p> */}


          </form>
      </div>
      )}
    </div>
    </>

  )
}

