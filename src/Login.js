import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import "./login.css";
import { auth } from "./firebase";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password).then((auth) => {
      //logged in, redirect to homepage
      history.push("/");
    });
  };
  return (
    <div className="form__container">
      <Form>
        <Form.Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="test123@test.com"
        />
        <Form.Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="secret"
        />

        <button onClick={login} type="submit" className="ui teal button">
          Login
        </button>
      </Form>
    </div>
  );
}

export default Login;
