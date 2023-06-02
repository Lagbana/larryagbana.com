import styled from "styled-components";
import { Nav, ShortenForm } from "./components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: "Arial", sans-serif;
`;

function App() {
  return (
    <Container>
      <Nav />
      <ShortenForm />
    </Container>
  );
}

export default App;
