import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';

function ListCourses(props) {
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const apiUrl = "http://localhost:3000/api/courses";

  useEffect(() => {
    const fetchData = async () => {

      var userData = await axios.get("/read_cookie");

      const data = {
        user: props.location.state ? null : userData.data.screen
      }

      const result = await axios.get(apiUrl, { params: data });
      setData(result.data);
      setShowLoading(false);
    };
    
    fetchData();
  }, []);

  const showDetail = (id) => {
    props.history.push({
      pathname: '/show/course/' + id
    });
  }

  return (
    <div>
      {showLoading && <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>}
      <Table striped responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Section</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr>
              <td className="align-middle">{idx}</td>
              <td className="align-middle">{item.name}</td>
              <td className="align-middle">{item.section}</td>
              <td className="align-middle">{item.code}</td>
              <td><Button key={idx} action onClick={() => { showDetail(item._id) }}>View course</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default withRouter(ListCourses);
