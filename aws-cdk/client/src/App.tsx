import styled from "styled-components";
import { Nav, ShortenForm } from "./components";

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin: 0 auto;
  max-width: 1600px;
  min-height: 100vh;
  padding: 5px 150px;

  @media (max-width: 1080px) {
    padding: 5px 100px;
  }
  @media (max-width: 768px) {
    padding: 5px 50px;
  }
  @media (max-width: 480px) {
    padding: 5px 25px;
  }

  background-color: #f8f9fa;
  font-family: "Arial", sans-serif;
`;

function App() {
  return (
    <Layout>
      <Nav />
      <ShortenForm />
    </Layout>
  );
}

export default App;
