import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";
import InputTweet from "./InputTweet";
import Tweets from "./Tweets";
import { db } from "./firebase";
import "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [tweets, setTweets] = useState([]);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    user && setUsername(user?.displayName);
    if (username == null) {
      window.location.reload();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection("tweets")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setTweets(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            tweet: doc.data(),
          }))
        )
      );
  }, []);

  return (
    <div className="app__container">
      <Router>
        <div>
          <Switch>
            <Route path="/login">
              <Header />
              <Login />
            </Route>

            <Route path="/register">
              <Header />
              <Register />
            </Route>

            <Route path="/">
              <div className="sticky__nav">
                <Header />

                <div className="tweets__input">
                  {user ? (
                    <>
                      <div className="tweets__display">
                        <h2>Welcome {username}</h2>
                      </div>
                      <InputTweet username={username} />
                    </>
                  ) : (
                    <div className="tweets__display">
                      <h2>Tweets</h2>
                    </div>
                  )}
                </div>
              </div>

              {tweets.map(({ id, tweet }) => (
                <div className="card__spacing">
                  <Tweets
                    key={id}
                    postId={id}
                    username={tweet.username}
                    image={tweet.image}
                    time={new Date(tweet.timestamp?.toDate()).toLocaleString()}
                    caption={tweet.caption}
                    user={user}
                    currentUser={username}
                    count={tweet.count}
                    like={tweet.like}
                  />
                </div>
              ))}
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
