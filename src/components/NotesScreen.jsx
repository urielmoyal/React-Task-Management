import React, { useEffect, useState } from "react";
import Header from "./Header";
import Note from "./Note";
import MyModal from "./UpdatePopUP";
import CreateArea from "./CreateArea";
import Row from "react-bootstrap/Row";
import { useRealmApp } from "./UserContext";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Loading from "./Loading";

function NotesScreen() {
  const app = useRealmApp();
  const mongodb = app.currentUser.mongoClient("mongodb-atlas").db("Kepper");
  const Notes = mongodb.collection("Notes");

  const [noteArray, setNoteArray] = useState([]);
  const [showNontesOf, setShowNotesOf] = useState("all");
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const [modal, setModal] = useState({
    show: false,
    note: {
      id: "",
      title: "",
      content: "",
      employee: "",
    },
  });

  function setUp() {
    //get all Notes from mangoDB 'Notes' collection
    const getNotesFromDb = async () => {
      const result = await app.currentUser.functions.getUserPermission();

      if (result.role === "manager") {
        await Notes.find({}).then((val) => {
          setNoteArray(val);
          setIsLoggingIn(false);
        });
      } else {
        await Notes.find({ employee: result.name }).then((val) => {
          setNoteArray(val);
          setIsLoggingIn(false);
        });
      }
    };

    //Listen to changes on the Colletion
    const dbListener = async () => {
      for await (const change of Notes.watch()) {
        switch (change.operationType) {
          case "insert": {
            const { documentKey, fullDocument } = change;
            console.log(`updated document: ${documentKey}`, fullDocument);
            setNoteArray((preVal) => {
              return [...preVal, fullDocument];
            });
            break;
          }
          case "update": {
            const { documentKey, fullDocument } = change;
            let id = JSON.stringify(documentKey._id);
            let findNoteById = (note) => JSON.stringify(note._id) === id;
            setNoteArray((preVal) => {
              let index = preVal.findIndex(findNoteById);
              preVal[index] = fullDocument;

              //to do : check why return preVal not rerender
              return new Array(...preVal);
            });
            break;
          }
          case "replace": {
            const { documentKey, fullDocument } = change;
            console.log(`replaced document: ${documentKey}`, fullDocument);
            break;
          }
          case "delete": {
            const { documentKey } = change;
            let id = JSON.stringify(documentKey._id);
            setNoteArray((prevVal) => {
              return prevVal.filter((Note) => {
                return JSON.stringify(Note._id) !== id;
              });
            });
            break;
          }
          default: {
          }
        }
      }
    };
    getNotesFromDb();
    dbListener();
  }

  useEffect(setUp, []);

  function closeModal() {
    setModal((prev) => {
      return { ...prev, show: false };
    });
  }

  function createNote(note) {
    return (
      <Note
        openModal={setModal}
        id={note.id}
        key={note.id}
        title={note.title}
        content={note.content}
        Employee={note.employee}
      />
    );
  }

  return (
    <div>
      {" "}
      {isLoggingIn ? (
        <Container>
          <Loading />
        </Container>
      ) : (
        <div>
          <MyModal show={modal.show} handleClose={closeModal} note={modal.note} />
          <Header setShowNotesOf={setShowNotesOf} />
          <CreateArea />
          <Row xs={1} md={3} className="g-4">
            {showNontesOf === "all"
              ? noteArray.map(createNote)
              : noteArray.filter((note) => note.employee === showNontesOf).map(createNote)}
          </Row>
        </div>
      )}{" "}
    </div>
  );
}

export default NotesScreen;

const Container = styled.div`
  height: 100vh;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  background: ${uiColors.gray.light2};
`;
