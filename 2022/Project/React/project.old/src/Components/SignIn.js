import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useState } from "react";
import { signIn } from "../API";

const initialState = {
  username: "",
  password: "",
  confirmpassword: "",
};

function SignIn({ setLogInPage, user, setUser }) {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn({
      username: state.username,
      password: state.password,
    });

    if (result.status == "error") {
      setError(result.message);
    } else {
      setError("");
      setUser({ ...user, logged: true });
      setState(initialState);
    }
  };

  return (
    <Form style={{ width: "50%", margin: "auto" }} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>User Name</Form.Label>
        <Form.Control
          onInput={handleChange}
          value={state["username"]}
          name="username"
          type="text"
          placeholder="Enter user name"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          onInput={handleChange}
          value={state["password"]}
          name="password"
          type="password"
          placeholder="Password"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        LogIn
      </Button>
      <div>
        Don't have an account{" "}
        <span
          onClick={() => {
            setLogInPage(false);
          }}
          style={{ color: "lightblue", cursor: "pointer" }}
        >
          Sign Up
        </span>
      </div>
      <div style={{ color: "red" }}>{error}</div>
    </Form>
  );
}

export default SignIn;
