import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { withRouter } from 'react-router-dom';

function ShowCourse(props) {
    const [data, setData] = useState({});
    const [showLoading, setShowLoading] = useState(true);
    const apiUrl = "http://localhost:3000/api/courses/" + props.match.params.id;

    useEffect(() => {
        setShowLoading(false);
        const fetchData = async () => {
            const result = await axios(apiUrl);
            setData(result.data, setShowLoading(false));
        };

        fetchData();
    }, []);

    const editCourse = (id) => {
        props.history.push({
            pathname: '/edit/course/' + id
        });
    };

    const deleteCourse = (id) => {
        setShowLoading(true);
        const course = {
            code: data.code,
            name: data.name,
            section: data.section,
            semester: data.semester,
            student: data.student
        };

        axios.delete(apiUrl, course)
            .then((result) => {
                setShowLoading(false);
                props.history.push('/courses')
            }).catch((error) => setShowLoading(false));
    };

    return (
        <div>
            {
                showLoading ? <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner> : 
                    <Jumbotron>
                        <h1>Course name: {data.name}</h1>
                        <p>Code: {data.code}</p>
                        <p>Section: {data.section}</p>
                        <p>Semester: {data.semester}</p>
                        <p>
                            <Button type="button" variant="primary" onClick={() => { editCourse(data._id) }}>Edit</Button>&nbsp;
                            <Button type="button" variant="danger" onClick={() => { deleteCourse(data._id) }}>Delete</Button>
                        </p>
                        <h2>Users taking this course</h2>
                        <ListGroup>
                            {
                                data.student != undefined 
                                    ? <ListGroup.Item>{data.student.fullName}</ListGroup.Item>
                                    : ""
                            }
                        </ListGroup>
                    </Jumbotron>
        }

        </div>
    );
}

export default withRouter(ShowCourse);
