import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';

function CreateCourse(props) {
  const [course, setCourse] = useState({ _id: '', code: '', name: '', 
                section: '', semester: '', student: null });
  const [showLoading, setShowLoading] = useState(false);
  const apiUrl = "http://localhost:3000/api/courses";

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

  const saveCourse = (e) => {
    setShowLoading(true);
    e.preventDefault();
    const data = { 
        code: course.code, 
        name: course.name, 
        section: course.section, 
        semester: course.semester, 
        student: screen
    };
    axios.post(apiUrl, data)
      .then((result) => {
        setShowLoading(false);
        props.history.push('/show/course/' + result.data._id)
      }).catch((error) => setShowLoading(false));
  };

  const onChange = (e) => {
    e.persist();
    setCourse({...course, [e.target.name]: e.target.value});
  }

  return (
    <div>
      {showLoading && 
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> 
      } 
      <Jumbotron>
        <Form onSubmit={saveCourse}>
          <Form.Group>
            <Form.Label>Course code</Form.Label>
            <Form.Control type="text" name="code" id="code" placeholder="Enter course code" value={course.code} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label> Course name</Form.Label>
            <Form.Control type="text" name="name" id="name" placeholder="Enter course name" value={course.name} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label> Course section</Form.Label>
            <Form.Control type="text" name="section" id="section" placeholder="Enter course section" value={course.section} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label> Course semester</Form.Label>
            <Form.Control type="text" name="semester" id="semester" placeholder="Enter course semester" value={course.semester} onChange={onChange} />
          </Form.Group>
          <Form.Control type="hidden" name="student" id="student" value={screen} onSubmit={onChange}></Form.Control>

          <Button variant="primary" type="submit">Save</Button>
        </Form>
      </Jumbotron>
    </div>
  );
}

export default withRouter(CreateCourse);
