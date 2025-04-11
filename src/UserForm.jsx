import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const UserForm = () => {
  const [formSchemaData, setFormSchemaData] = useState();
  const [formValues, setFormValues] = useState({});
  const { pathname } = useLocation();

  function findForm() {
    axios
      .post("https://asignment2.onrender.com/get-form" + pathname)
      .then((success) => {
        setFormSchemaData(success.data);
      })
      .catch((error) => {
        console.log("error in UserForm:", error.message);
      });
  }

  useEffect(() => {
    findForm();
  }, []);

  function handleChange(e, fieldName, fieldType) {
    if (fieldType === "checkbox") {
      const updatedValues = formValues[fieldName] || [];
      if (e.target.checked) {
        setFormValues({
          ...formValues,
          [fieldName]: [...updatedValues, e.target.value],
        });
      } else {
        setFormValues({
          ...formValues,
          [fieldName]: updatedValues.filter((val) => val !== e.target.value),
        });
      }
    } else {
      setFormValues({
        ...formValues,
        [fieldName]: e.target.value,
      });
    }
  }

  function fillForm(e) {
    e.preventDefault();
    alert("User data saved; checked Console");
    console.log("Collected Form Data:", formValues);
    setFormValues({});
  }

  if (!formSchemaData || !formSchemaData.formSchema)
    return <p>No form data available</p>;

  const { formName, formId, formSchema } = formSchemaData.formSchema;

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">{formName}</h3>
      <Form onSubmit={fillForm} id={formId}>
        {formSchema?.map((field, index) => {
          const { fieldType, fieldName, charectorLimit, options } = field;
          const fieldId = `field-${index}`;

          switch (fieldType) {
            case "text":
            case "email":
            case "password":
              return (
                <Form.Group className="mb-3" controlId={fieldId} key={index}>
                  <Form.Label>{fieldName}</Form.Label>
                  <Form.Control
                    type={fieldType}
                    placeholder={`Enter ${fieldName}`}
                    maxLength={charectorLimit || ""}
                    value={formValues[fieldName] || ""}
                    onChange={(e) => handleChange(e, fieldName)}
                  />
                </Form.Group>
              );

            case "select":
              return (
                <Form.Group className="mb-3" controlId={fieldId} key={index}>
                  <Form.Label>{fieldName}</Form.Label>
                  <Form.Select
                    value={formValues[fieldName] || ""}
                    onChange={(e) => handleChange(e, fieldName)}
                  >
                    <option value="">Select {fieldName}</option>
                    {options?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              );

            case "radio":
              return (
                <Form.Group className="mb-3" key={index}>
                  <Form.Label>{fieldName}</Form.Label>
                  {options?.map((opt, i) => (
                    <Form.Check
                      key={i}
                      type="radio"
                      label={opt}
                      name={fieldName}
                      value={opt}
                      checked={formValues[fieldName] === opt}
                      onChange={(e) => handleChange(e, fieldName)}
                      className="d-block"
                    />
                  ))}
                </Form.Group>
              );

            case "checkbox":
              return (
                <Form.Group className="mb-3" key={index}>
                  <Form.Label>{fieldName}</Form.Label>
                  {options?.map((opt, i) => (
                    <Form.Check
                      key={i}
                      type="checkbox"
                      label={opt}
                      name={`${fieldId}-${i}`}
                      value={opt}
                      checked={
                        formValues[fieldName]
                          ? formValues[fieldName].includes(opt)
                          : false
                      }
                      onChange={(e) =>
                        handleChange(e, fieldName, "checkbox")
                      }
                      className="d-block"
                    />
                  ))}
                </Form.Group>
              );

            default:
              return null;
          }
        })}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default UserForm;
