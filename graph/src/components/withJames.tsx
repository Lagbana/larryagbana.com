import { useState, useCallback, useEffect } from "react";

const BlockStyle = {
  width: "100px",
  height: "100px",
  border: "1px solid black",
  display: "flex",
  borderRadius: "100px 80px 100px 80px",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
};

interface BlockProps {
  isWinner: boolean;
  value: string;
  setValue: () => void;
}
const Block = ({ value, setValue, isWinner }: BlockProps) => {
  const handleClick = useCallback(() => {
    setValue();
  }, [setValue]);
  return (
    <button
      style={{
        ...BlockStyle,
        backgroundColor: isWinner ? "turquoise" : "lightblue",
      }}
      onClick={handleClick}
    >
      {value}
    </button>
  );
};

const winningCombinations = [
  [2, 4, 6],
  [0, 4, 8],
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

export function TicTacToe({ numberOfElements }: { numberOfElements: number }) {
  const [board, setBoard] = useState<Array<string>>(
    Array(numberOfElements).fill("")
  );
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winningPostions, setWinningPostions] = useState<Array<number | null>>([
    null,
    null,
    null,
  ]);
  const [gameOutcome, setGameOutcome] = useState("");

  const Gridstyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${Math.sqrt(numberOfElements)}, 1fr)`,
    gridGap: "10px",
  } as const;

  const resetGame = useCallback(() => {
    setBoard(Array(numberOfElements).fill(""));
    setWinningPostions([null, null, null]);
    setCurrentPlayer("X");
    setGameOutcome("");
  }, []);

  // ! O(n) check
  const isBoardFull = useCallback(() => {
    return !board.some((value) => value === "");
  }, [board]);

  const endGame = useCallback(() => {
    // ! O(n) check
    for (let combination of winningCombinations) {
      const idx1 = combination[0],
        idx2 = combination[1],
        idx3 = combination[2];

      if (
        board[idx1] === board[idx2] &&
        board[idx1] === board[idx3] &&
        !!board[idx1]
      ) {
        setWinningPostions([idx1, idx2, idx3]);
        setGameOutcome(`Player: ${board[idx1]} won!`);
        return true;
      }
    }
    if (isBoardFull()) {
      setGameOutcome(`Draw game 🤝`);
      return true;
    }
    return false;
  }, [
    isBoardFull,
    gameOutcome,
    setGameOutcome,
    currentPlayer,
    setCurrentPlayer,
  ]);

  // Check if we can keep playing
  useEffect(() => {
    endGame();
  }, [board, endGame]);

  const makeMove = useCallback(
    (index: number) => {
      if (gameOutcome) {
        return;
      }

      if (board[index] === "") {
        const currentBoard = [...board];
        currentBoard[index] = currentPlayer;
        setBoard(currentBoard);

        if (!gameOutcome) {
          currentPlayer === "X" ? setCurrentPlayer("O") : setCurrentPlayer("X");
        }
      } else {
        alert("Space occupied!");
      }
    },
    [currentPlayer, board, endGame, gameOutcome]
  );

  return (
    <div>
      <h1> Tic Tac Toe</h1>
      <div style={Gridstyle}>
        {board.map((value, index) => {
          const isWinner = winningPostions.includes(index);
          return (
            <div key={`${index}-${value}`}>
              <Block
                value={value}
                setValue={() => makeMove(index)}
                isWinner={isWinner}
              />
            </div>
          );
        })}
      </div>
      <br />
      <br />
      {gameOutcome && <div>{gameOutcome}</div>}
      <br />
      <br />
      {gameOutcome && (
        <button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={resetGame}
        >
          {"Rest game"}
        </button>
      )}
    </div>
  );
}
