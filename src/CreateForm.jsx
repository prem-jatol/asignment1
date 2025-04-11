import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateForm = () => {
  const [formArr, setFormArr] = useState([]);
  const [formName, setFormName] = useState("");
  const [colorPallet, setColorPallet] = useState([]);

  const navigator = useNavigate();

  const [field, setField] = useState({
    fieldName: "",
    fieldType: "",
    charectorLimit: "",
    options: [],
    optionInput: "",
  });

  const toggleColor = (color) => {
    setColorPallet((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const addOption = () => {
    if (field.optionInput.trim() !== "") {
      setField({
        ...field,
        options: [...field.options, field.optionInput],
        optionInput: "",
      });
    }
  };

  const addField = (e) => {
    e.preventDefault();
    const { fieldName, fieldType, charectorLimit, options } = field;

    if (!fieldName || !fieldType)
      return alert("Please fill all required field details");

    const newField = {
      fieldType,
      fieldName,
    };

    if (["text", "password"].includes(fieldType)) {
      newField.charectorLimit = Number(charectorLimit);
    } else if (["select", "checkbox", "radio"].includes(fieldType)) {
      newField.options = options;
    }

    setFormArr([...formArr, newField]);

    setField({
      fieldName: "",
      fieldType: "",
      charectorLimit: "",
      options: [],
      optionInput: "",
    });
  };

  const createForm = (e) => {
    e.preventDefault();
    if (!formName) return alert("Form name is required");
    const formSlug = formName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    axios.post("http://localhost:5000/create-form", {
        formName,
        formId: formSlug,
        colorPallet,
        formArr
      })
      .then((success) => {
        console.log(success.data);
        alert("Form structure created. Check console.");
        navigator(`/${formSlug}`);
      })
      .catch((error) => {
        console.log(error.message);
        alert("Please Try again. Check console.");
      });
  };

  return (
    <div className="container my-4">
      <h2>Create New Form</h2>
      <form onSubmit={createForm} className="p-4 border rounded shadow">
        <div className="mb-3">
          <label className="form-label">Enter your form name</label>
          <input
            type="text"
            className="form-control"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>

        <h4>Add fields for your form</h4>
        <div className="mb-4 p-3 border rounded">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Field name"
            value={field.fieldName}
            onChange={(e) => setField({ ...field, fieldName: e.target.value })}
          />

          <select
            className="form-select mb-2"
            value={field.fieldType}
            onChange={(e) => setField({ ...field, fieldType: e.target.value })}
          >
            <option value="">Select field type</option>
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
          </select>

          {["text", "password"].includes(field.fieldType) && (
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Character limit"
              value={field.charectorLimit}
              onChange={(e) =>
                setField({ ...field, charectorLimit: e.target.value })
              }
            />
          )}

          {["select", "checkbox", "radio"].includes(field.fieldType) && (
            <>
              <div className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write option"
                  value={field.optionInput}
                  onChange={(e) =>
                    setField({ ...field, optionInput: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={addOption}
                >
                  +
                </button>
              </div>
              <div className="mb-2">
                {field.options.map((opt, idx) => (
                  <span key={idx} className="badge bg-secondary me-2">
                    {opt}
                  </span>
                ))}
              </div>
            </>
          )}

          <button className="btn btn-sm btn-primary" onClick={addField}>
            Add Field
          </button>
        </div>

        <div className="mb-4">
          <label className="form-label">Color Palette</label>
          <div className="d-flex gap-3">
            {["green", "red", "orange"].map((color) => (
              <span
                key={color}
                className={`btn btn-sm ${
                  colorPallet.includes(color) ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => toggleColor(color)}
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          Create Form
        </button>
      </form>

      <div className="mt-5">
        <h5>Live Form Structure Preview:</h5>
        <pre>
          {JSON.stringify([{ formName, colorPallet }, ...formArr], null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CreateForm;
