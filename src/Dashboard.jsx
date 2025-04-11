import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [formsData, setFormsData] = useState();

  function getAllForm() {
    axios
      .get("http://localhost:5000/get-forms")
      .then((success) => {
        if (success.data.status === 1) {
          setFormsData(success.data.allForms);
        }
      })
      .catch((error) => {});
  }

  useEffect(() => {
    getAllForm();
  }, []);

  const handleDelete = async (formId) => {
    try {
      await axios.delete(`http://localhost:5000/delete-form/${formId}`);
      getAllForm();
    } catch (error) {
      console.log("Delete error:", error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Admin Panel</h2>
        <Link to="/dashboard/create-form">
          <Button variant="success">Create New Form</Button>
        </Link>
      </div>

      <hr />
      <div className="container mt-4">
        <h4 className="mb-3">All Forms</h4>
        <Table responsive bordered hover striped>
          <thead className="table-dark">
            <tr>
              <th>Form Name</th>
              <th>Form ID</th>
              <th>Created Date</th>
              <th>Form Link</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {formsData?.map((form, index) => (
              <tr key={index}>
                <td>{form.formName}</td>
                <td>{form.formId}</td>
                <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/${form.formId}`} className="btn btn-sm btn-info">
                    Link
                  </Link>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(form._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
