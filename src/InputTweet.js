import React, { useState } from "react";
import { Form, TextArea } from "semantic-ui-react";
import { db, storage } from "./firebase";
import "./inputtweet.css";
import firebase from "firebase";
import { AddAPhoto, Send } from "@material-ui/icons";

function InputTweet({ username }) {
  const [input, setInput] = useState("");
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  window.onscroll = scrollShowNav;
  function scrollShowNav() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementsByClassName("input__container")[0].style.top =
        "-50px";
    } else {
      document.getElementsByClassName("input__container")[0].style.top = "0px";
    }
  }

  const upload = (e) => {
    e.preventDefault();

    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",

        (snapshot) => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          //error function
          console.log(error);
          alert(error.message);
        },

        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              //post image inside db
              db.collection("tweets").add({
                caption: input,
                username: username,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                image: url,
                count: 0,
                like: 0,
              });
            });
        }
      );
    } else {
      db.collection("tweets").add({
        caption: input,
        username: username,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        count: 0,
        like: 0,
      });
    }
    setProgress(0);
    setImage("");
    setInput("");
  };

  return (
    <div>
      <Form>
        <div className="input__nav input__container">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's on your mind...?"
          />

          <label className="custom-file-upload">
            <input type="file" onChange={handleChange} />
            <AddAPhoto />
          </label>

          <button onClick={upload} type="submit" className="ui teal button">
            <Send />
          </button>
        </div>
      </Form>
    </div>
  );
}

export default InputTweet;
