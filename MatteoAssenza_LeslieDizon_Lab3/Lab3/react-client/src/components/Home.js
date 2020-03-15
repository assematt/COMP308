
import { withRouter } from 'react-router-dom';

import React, { useState, useEffect, Component }  from 'react';
import Button from "react-bootstrap/Button";
import axios from "axios";

function Home(props)
{
    const [screen, setScreen] = useState("auth");

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
  
    const logOut = async () => {
      try {
        console.log("--- Loggin out function ---");
  
        //
        const res = await axios.get("/signout");
        //
        if (res.data.screen !== undefined) {
          setScreen(res.data.screen);
          console.log(res.data.screen);
        }
      } catch (e) {
        setScreen("auth");
        console.log(e);
      }    
    }
  
    //runs the first time the view is rendered
    //to check if user is signed in
    useEffect(() => {
      readCookie();
    }, []); //only the first render
  

    return (
        <div>
            <svg class="d-block mx-auto text-info" width="27em" height="27em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M17.285 2.089a.5.5 0 01.215.411v15a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V16h-1v1.5a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5v-6a.5.5 0 01.418-.493l5.582-.93V5.5a.5.5 0 01.324-.468l8-3a.5.5 0 01.46.057zM9.5 5.846V10.5a.5.5 0 01-.418.493l-5.582.93V17h8v-1.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5V17h2V3.221l-7 2.625z" clip-rule="evenodd"></path>
                <path fill-rule="evenodd" d="M8.5 17.5v-7h1v7h-1z" clip-rule="evenodd"></path>
                <path d="M4.5 13h1v1h-1v-1zm2 0h1v1h-1v-1zm-2 2h1v1h-1v-1zm2 0h1v1h-1v-1zm6-10h1v1h-1V5zm2 0h1v1h-1V5zm-4 2h1v1h-1V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zm-2 2h1v1h-1V9zm2 0h1v1h-1V9zm-4 0h1v1h-1V9zm0 2h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-4 2h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1z"></path>
            </svg>
            <h1 className="text-center">Student Course System</h1>
            {screen === "auth" ? (
                <h6 className="text-center text-secondary">Please Login/Sign Up to start</h6>
              ) :
              (
                <div className="text-center">
                    <h1>Welcome, {screen}</h1>
                    <Button href="/course" variant="primary" className="mr-1">Create a course</Button>
                    <Button href="/courses" variant="primary" className="mr-1">List courses</Button>
                </div>
              )}   
            
        </div>        
    );
}

export default withRouter(Home);