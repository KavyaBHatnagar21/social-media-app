import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import "./register.css";
import { auth } from "./firebase";

function Register() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const register = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        history.push("/");

        return auth.user.updateProfile({
          displayName: username,
        });
      })
      .catch((e) => alert(e.message));
  };

  return (
    <div className="form__container">
      <Form>
        <Form.Field>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </Form.Field>
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
        <button onClick={register} type="submit" className="ui teal button">
          Register
        </button>
      </Form>
    </div>
  );
}

export default Register;
