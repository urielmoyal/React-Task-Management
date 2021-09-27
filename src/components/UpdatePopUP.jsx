import { React, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useRealmApp } from "./UserContext";

function UpdatePopUP(props) {
  const [noteToUpdate, setNoteToUpdate] = useState({
    title: "",
    content: "",
    employee: "",
  });

  const app = useRealmApp();
  const mongodb = app.currentUser.mongoClient("mongodb-atlas").db("Kepper");
  const Notes = mongodb.collection("Notes");

  function updateNote() {
    Notes.updateOne(
      { id: props.note.id },
      {
        $set: {
          title: noteToUpdate.title,
          content: noteToUpdate.content,
          employee: noteToUpdate.employee,
        },
      }
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setNoteToUpdate((preVal) => {
      return { ...preVal, [name]: value };
    });
  }

  useEffect(() => {
    if (props.note) {
      setNoteToUpdate({
        title: props.note.title,
        content: props.note.content,
        employee: props.note.employee,
      });
    }
  }, [props]);

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <input
            name="title"
            value={noteToUpdate.title}
            placeholder="Title"
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            value={noteToUpdate.content}
            placeholder="Take a note..."
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
              value={noteToUpdate.employee}
              onChange={handleChange}
              required
            >
              <option value="">Choose...</option>
              <option value="Employee_1">Employee 1</option>
              <option value="Employee_2">Employee 2</option>
              <option value="Employee_3">Employee 3</option>
            </select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.handleClose();
            updateNote();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdatePopUP;
