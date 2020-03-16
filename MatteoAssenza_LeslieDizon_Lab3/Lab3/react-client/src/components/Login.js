import React, { useState, useEffect } from "react";
//import ReactDOM from 'react-dom';
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
//
//import View from './View'
//
function App() {
  //state variable for the screen, admin or user
  const [screen, setScreen] = useState("auth");
  //store input field data, user name and password
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const apiUrl = "http://localhost:3000/signin";
  //send username and password to the server
  // for initial authentication
  const auth = async () => {
    console.log("calling auth");
    console.log(username);
    try {
      //make a get request to /authenticate end-point on the server
      const loginData = { username: username, password: password } };
      //call api
      const res = await axios.post(apiUrl, loginData);
      console.log(res.data.auth);
      console.log(res.data.screen);
      //process the response
      if (res.data.screen !== undefined) {
        setScreen(res.data.screen);
        console.log(res.data.screen);
        window.location.reload(false);
      }
    } catch (e) {
      //print the error
      console.log(e);
    }
  };

  //check if the user already logged-in
  const readCookie = async () => {
    try {
      console.log("--- in readCookie function ---");

      //
      const res = await axios.get("/read_cookie");
      //
      if (res.data.screen !== undefined) {
        setScreen(res.data.screen);
        console.log(res.data.screen);
      }
    } catch (e) {
      setScreen("auth");
      console.log(e);
    }
  };
  //runs the first time the view is rendered
  //to check if user is signed in
  useEffect(() => {
    readCookie();
  }, []); //only the first render
  //
  return (
    <div className="App">
      {screen === "auth" ? (
        <form className="w-25 form-signin mx-auto">
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          <div className="form-group">
            <label for="Username" className="sr-only">Username</label>
            <input type="text" id="Username" className="form-control" placeholder="Username" required="" autofocus="" onChange={e => setUsername(e.target.value)}/>
          </div>
          <div className="form-group">
            <label for="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <Button onClick={auth} as="input" type="submit" value="Sign in" block />
          </div>          
        </form>
      ) : (
                  
        <h1>Welcome, {screen}</h1>
      )}
    </div>
  );
}

export default App;
