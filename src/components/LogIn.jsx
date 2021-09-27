import React, { useState } from "react";
import styled from "@emotion/styled";
import * as Realm from "realm-web";
import { useRealmApp } from "./UserContext";
import TextInput from "@leafygreen-ui/text-input";
import Button from "react-bootstrap/Button";
import Loading from "./Loading";
import { uiColors } from "@leafygreen-ui/palette";
import Card from "react-bootstrap/Card";

function Login(props) {
  const app = useRealmApp();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (ev) => {
    setIsLoggingIn(true);

    setError((e) => ({ ...e, password: null }));
    try {
      await app.logIn(Realm.Credentials.emailPassword(email, password));
    } catch (err) {
      handleAuthenticationError(err, setError, setIsLoggingIn);
    }
  };

  return (
    <Container>
      {isLoggingIn ? (
        <Loading />
      ) : (
        <Card>
          <Card.Title className="d-flex justify-content-center">Sign In</Card.Title>
          <Card.Body>
            <LoginFormRow>
              <TextInput
                type="email"
                label="Email"
                placeholder="your.email@example.com"
                onChange={(e) => {
                  setError((e) => ({ ...e, email: null }));
                  setEmail(e.target.value);
                }}
                value={email}
                state={error.email ? "error" : "none"}
                errorMessage={error.email}
              />
            </LoginFormRow>
            <LoginFormRow>
              <TextInput
                type="password"
                label="Password"
                placeholder="pa55w0rd"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                state={error.password ? "error" : error.password ? "valid" : "none"}
                errorMessage={error.password}
              />
            </LoginFormRow>
            <LoginFormRow>
              <Button variant="primary" onClick={() => handleLogin()}>
                Log In
              </Button>
            </LoginFormRow>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

function handleAuthenticationError(err, setError, setIsLoggingIn) {
  setIsLoggingIn(false);
  const { status, message } = parseAuthenticationError(err);
  const errorType = message || status;
  switch (errorType) {
    case "invalid username":
      setError((prevErr) => ({ ...prevErr, email: "Invalid email address." }));
      break;
    case "invalid username/password":
    case "invalid password":
    case "401":
      setError((err) => ({ ...err, password: "invalid username/password." }));
      break;
    case "name already in use":
    case "409":
      setError((err) => ({ ...err, email: "Email is already registered." }));
      break;
    case "password must be between 6 and 128 characters":
    case "400":
      setError((err) => ({
        ...err,
        password: "Password must be between 6 and 128 characters.",
      }));
      break;
    default:
      break;
  }
}

function parseAuthenticationError(err) {
  const parts = err.message.split(":");
  const reason = parts[parts.length - 1].trimStart();
  if (!reason) return { status: "", message: "" };
  const reasonRegex = /(?<message>.+)\s\(status (?<status>[0-9][0-9][0-9])/;
  const match = reason.match(reasonRegex);
  const { status, message } = match?.groups ?? {};
  return { status, message };
}

export default Login;

const LoginFormRow = styled.div`
  margin-bottom: 16px;
`;

const Container = styled.div`
  height: 100vh;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  background: ${uiColors.gray.light2};
`;
