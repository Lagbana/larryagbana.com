import { useState } from "react";
import { Navigate } from "react-router-dom";

const withAuthService = () => {};

interface LoginProps {}
export function Login({}: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async () => {
    // event.preventDefault();
  };

  return (
    <div role='main'>
      {loginSuccess && <Navigate to='/profile' replace={true} />}
      <h2> Please login</h2>
      <form onSubmit={null}>
        <label>User name</label>
        <input value={username} onChange={null} />
        <br />
        <label>Password</label>
        <input value={password} onChange={null} type='password' />
        <br />
        <input type='submit' value={"Login"} />
      </form>
      <br />
    </div>
  );
}
