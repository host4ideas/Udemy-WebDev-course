import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  const [inputClicked, setInputClicked] = useState(false);

  return (
    <div>
      <form onClick={() => setInputClicked(true)} className="create-note">
        {inputClicked && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={inputClicked ? 3 : 1}
        />
        {inputClicked && (
          <Zoom in={true}>
            <Fab onClick={submitNote} color="secondary" aria-label="add">
              <AddIcon />
            </Fab>
          </Zoom>
        )}
      </form>
    </div>
  );
}

export default CreateArea;
