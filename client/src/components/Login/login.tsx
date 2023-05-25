import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthService } from "../../hooks/useAuthService";
interface LoginProps {
  setUserCb: (username: string) => void;
}
export function Login({ setUserCb }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const authService = useAuthService();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (username && password) {
      const loginResponse = await authService.login(username, password);
      const authUser = authService.getUsername();
      if (authUser) {
        setUserCb(authUser);
      }
      if (loginResponse) {
        setLoginSuccess(true);
      } else {
        setErrorMessage("Invalid credentials");
      }
    } else {
      setErrorMessage("username and password required!");
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target.name;
    if (target === "username") {
      return setUsername(event.target.value);
    }
    if (target === "password") {
      return setPassword(event.target.value);
    }
  };

  return (
    <div role='main'>
      {loginSuccess && <Navigate to='/profile' replace={true} />}
      <h2> Please login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          name='username'
          type='text'
          value={username}
          autoComplete='username'
          onChange={handleInputChange}
          required
        />
        <br />
        <label>Password</label>
        <input
          name='password'
          type='password'
          value={password}
          onChange={handleInputChange}
          autoComplete='current-password'
          minLength={8}
          required
        />
        <br />
        <input type='submit' value={"Login"} />
      </form>
      <br />
      <div>{errorMessage}</div>
    </div>
  );
}
