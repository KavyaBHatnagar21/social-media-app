import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./tweets.css";
import {
  Button,
  Icon,
  Comment,
  Label,
  Card,
  Image,
  Form,
} from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { db } from "./firebase";
import firebase from "firebase";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    overflow: "scroll",
    height: 400,
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Tweets({ username, time, caption, postId, count, user, like, image }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likers, setLikers] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("tweets")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("tweets")
        .doc(postId)
        .collection("likers")
        .onSnapshot((snapshot) => {
          setLikers(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const addComment = (e) => {
    e.preventDefault();
    db.collection("tweets").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    db.collection("tweets")
      .doc(postId)
      .update({
        count: count + 1,
      });

    setComment("");
  };

  const onDelete = () => {
    db.collection("tweets").doc(postId).delete();
  };

  const onLike = () => {
    const likerArr = [];
    likers.map((liker) => {
      return likerArr.push(liker.username);
    });

    console.log("likers array>", likers);
    if (likerArr.includes(user.displayName)) {
      db.collection("tweets")
        .doc(postId)
        .update({
          like: like - 1,
        });

      db.collection("tweets")
        .doc(postId)
        .collection("likers")
        .where("username", "==", user.displayName)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.map((doc) => {
            return doc.ref.delete();
          });
        });
    } else {
      db.collection("tweets").doc(postId).collection("likers").add({
        username: user.displayName,
      });
      db.collection("tweets")
        .doc(postId)
        .update({
          like: like + 1,
        });
    }
  };

  return (
    <div className="tweets__displaycards">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          {comments.map((comment) => (
            <Comment.Group>
              <Comment>
                <Comment.Avatar
                  as="a"
                  src={`https://avatars.dicebear.com/api/initials/${comment.username}.svg?radius=50`}
                />
                <Comment.Content>
                  <Comment.Author>{comment.username}</Comment.Author>
                  <Comment.Metadata>
                    <div>
                      {new Date(comment.timestamp?.toDate()).toLocaleString()}
                    </div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.text}</Comment.Text>
                </Comment.Content>
              </Comment>
            </Comment.Group>
          ))}

          {user && (
            <Form reply>
              <Form.TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder="Add a comment..."
              />
              <button
                onClick={addComment}
                type="submit"
                className="ui teal button"
              >
                Add
              </button>
            </Form>
          )}
        </div>
      </Modal>

      <Grid.Column>
        <Card.Group>
          <Card style={{ width: " 400px" }}>
            <Card.Content>
              <Image
                floated="right"
                size="mini"
                src={`https://avatars.dicebear.com/api/initials/${username}.svg?radius=50`}
              />
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{time}</Card.Meta>
              <Card.Description>{caption}</Card.Description>
            </Card.Content>
            <Image src={image} />
            <Card.Content extra>
              <div className="button__nav">
                <Button as="div" labelPosition="right">
                  {user ? (
                    <Button basic color="red" onClick={onLike}>
                      <Icon name="like" />
                    </Button>
                  ) : (
                    <Button basic color="red">
                      <Icon name="like" />
                    </Button>
                  )}
                  <Label as="a" basic color="red" pointing="left">
                    {like}
                  </Label>
                </Button>
                <Button
                  onClick={() => setOpen(true)}
                  as="div"
                  labelPosition="right"
                >
                  <Button basic color="blue">
                    <Icon name="comment" />
                  </Button>
                  <Label as="a" basic color="blue" pointing="left">
                    {count}
                  </Label>
                </Button>
                {username === user?.displayName ? (
                  <button
                    onClick={onDelete}
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      cursor: "pointer",
                      padding: "0px",
                    }}
                  >
                    <Icon
                      className="bin__button"
                      color="red"
                      name="trash alternate"
                    />
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </Grid.Column>
    </div>
  );
}

export default Tweets;
