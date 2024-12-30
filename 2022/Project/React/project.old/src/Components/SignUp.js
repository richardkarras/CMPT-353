import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { signUp } from "../API";
const initialState = {
  username: "",
  password: "",
  confirmpassword: "",
};

function SignUp({ setLogInPage, user, setUser }) {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("error here");

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signUp({
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

    //
  };

  return (
    <Form style={{ width: "50%", margin: "auto" }} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>User name</Form.Label>
        <Form.Control
          onInput={handleChange}
          value={state["username"]}
          name="username"
          type="text"
          placeholder="Enter your user name"
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
      <Form.Group className="mb-3" controlId="confirmpassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          onInput={handleChange}
          value={state["confirmpassword"]}
          name="confirmpassword"
          type="password"
          placeholder="Confirm password"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Sign Up
      </Button>

      <div>
        Already have account{" "}
        <span
          onClick={() => {
            setLogInPage(true);
          }}
          style={{ color: "lightblue", cursor: "pointer" }}
        >
          Log in
        </span>
      </div>
      <div style={{ color: "red" }}>{error}</div>
    </Form>
  );
}

export default SignUp;
