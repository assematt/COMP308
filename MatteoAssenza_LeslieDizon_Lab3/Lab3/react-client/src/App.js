import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
//
import Button from "react-bootstrap/Button"
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./App.css";
//
import List from "./components/List";
import EditUser from "./components/EditUser";

import CreateUser from "./components/CreateUser";
import ShowUser from "./components/ShowUser";

import Home from "./components/Home";
import Login from "./components/Login";
//
function App() {
  return (
    <Router>
      <div className="container">
        <Navbar expand="lg">
          <Navbar.Brand href="/home">
            <svg class="bi bi-building text-info" width="50px" height="50px" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M17.285 2.089a.5.5 0 01.215.411v15a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V16h-1v1.5a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5v-6a.5.5 0 01.418-.493l5.582-.93V5.5a.5.5 0 01.324-.468l8-3a.5.5 0 01.46.057zM9.5 5.846V10.5a.5.5 0 01-.418.493l-5.582.93V17h8v-1.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5V17h2V3.221l-7 2.625z" clip-rule="evenodd"></path>
              <path fill-rule="evenodd" d="M8.5 17.5v-7h1v7h-1z" clip-rule="evenodd"></path>
              <path d="M4.5 13h1v1h-1v-1zm2 0h1v1h-1v-1zm-2 2h1v1h-1v-1zm2 0h1v1h-1v-1zm6-10h1v1h-1V5zm2 0h1v1h-1V5zm-4 2h1v1h-1V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zm-2 2h1v1h-1V9zm2 0h1v1h-1V9zm-4 0h1v1h-1V9zm0 2h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-4 2h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1z"></path>
            </svg>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Button href="/login" variant="primary" className="mr-1">Login</Button>
              <Button href="/create" variant="outline-primary">Sign Up</Button>
              {/*
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/list">List of Users</Nav.Link>
              <Nav.Link href="/create">Sign Up</Nav.Link>
              */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <div className="container">
        <Route render={() => <Home />} exact path="/" />
        <Route render={() => <Home />} path="/home" />
        <Route render={() => <Login />} path="/login" />
        <Route render={() => <List />} path="/list" />
        <Route render={() => <EditUser />} path="/edit/:id" />
        <Route render={() => <CreateUser />} path="/create" />
        <Route render={() => <ShowUser />} path="/show/:id" />
      </div>
    </Router>
  );
}

export default App;