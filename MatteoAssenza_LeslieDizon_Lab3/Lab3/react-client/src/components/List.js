import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';

function List(props) {
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const apiUrl = "http://localhost:3000/users";

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(apiUrl);
      setData(result.data);
      setShowLoading(false);
    };

    fetchData();
  }, []);

  const showDetail = (id) => {
    props.history.push({
      pathname: '/show/' + id
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
            <th>First Name</th>
            <th>Last heading</th>
            <th>Student Id</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr>
              <td className="align-middle">{idx}</td>
              <td className="align-middle">{item.firstName}</td>
              <td className="align-middle">{item.lastName}</td>
              <td className="align-middle">{item.username}</td>
              <td><Button key={idx} action onClick={() => { showDetail(item._id) }}>View user</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default withRouter(List);
