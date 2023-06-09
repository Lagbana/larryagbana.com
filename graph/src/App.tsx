import { TicTacToe } from "./components/withJames";

import "./App.css";

const BackgroundStyle = {
  width: "80vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "lightgray",
  padding: "40px",
} as const;

function App() {
  return (
    <div style={BackgroundStyle}>
      <TicTacToe numberOfElements={9} />
    </div>
  );
}

export default App;
