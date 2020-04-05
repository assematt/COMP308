import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';

function EditCourse(props) {
    const [screen, setScreen] = useState("auth");
    const [course, setCourse] = useState({
        _id: '', code: '', name: '',
        section: '', semester: '', student: null
    });
    const [showLoading, setShowLoading] = useState(true);
    const apiUrl = "http://localhost:3000/api/courses/" + props.match.params.id;

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

    //runs only once after the first render
    useEffect(() => {
        setShowLoading(false);
        //call api
        const fetchData = async () => {
            const result = await axios(apiUrl);
            setCourse(result.data);
            console.log(result.data);
            setShowLoading(false);
        };

        fetchData();
        readCookie();
    }, []);

    const updateCourse = (e) => {
        setShowLoading(true);
        e.preventDefault();
        const data = {
            code: course.code,
            name: course.name,
            section: course.section,
            semester: course.semester,
            user: screen
        };
        axios.put(apiUrl, data)
            .then((result) => {
                setShowLoading(false);
                props.history.push('/show/course/' + result.data._id)
            }).catch((error) => 
            setShowLoading(false));
    };
    //runs when user enters a field
    const onChange = (e) => {
        e.persist();
        setCourse({ ...course, [e.target.name]: e.target.value });
    }

    return (
        <div>
            {showLoading &&
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            }
            <Jumbotron>
                <Form onSubmit={updateCourse}>
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
                    <Form.Control type="hidden" name="user" id="user" value={screen} onSubmit={onChange}></Form.Control>
                    <Button variant="primary" type="submit">Update</Button>
                </Form>
            </Jumbotron>
        </div>
    );
}

export default withRouter(EditCourse);
