import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRealmApp } from "./UserContext";

function CreateArea() {
  const app = useRealmApp();
  const mongodb = app.currentUser.mongoClient("mongodb-atlas").db("Kepper");
  const Notes = mongodb.collection("Notes");

  const [noteInput, setNoteInPut] = useState({
    id: "",
    title: "",
    content: "",
    employee: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setNoteInPut((preVal) => {
      return { ...preVal, [name]: value, id: uuidv4() };
    });
  }

  function addNote(e) {
    e.preventDefault();
    Notes.insertOne(noteInput)
      .then((result) => {
        console.log(`Successfully inserted item with _id: ${result.insertedId}`);
        setNoteInPut({
          id: "",
          title: "",
          content: "",
          employee: "",
        });
      })
      .catch((err) => console.error(`Failed to insert item: ${err}`));
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input
          name="title"
          value={noteInput.title}
          placeholder="Title"
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          value={noteInput.content}
          placeholder="Add Description "
          onChange={handleChange}
          rows="3"
          required
        />
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="employeesSelect">
              Choose Employ
            </label>
          </div>
          <select
            name="employee"
            className="custom-select"
            id="employeesSelect"
            onChange={handleChange}
            required
          >
            <option value="">Choose...</option>
            <option value="Employee_1">Employee 1</option>
            <option value="Employee_2">Employee 2</option>
            <option value="Employee_3">Employee 3</option>
          </select>
        </div>

        <button id="noteButton" type="submit">
          +
        </button>
      </form>
    </div>
  );
}

export default CreateArea;
