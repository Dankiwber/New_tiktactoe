import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import icon from "../../constant/icon";

const App = () => {
  const initialBoard = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [current, setCurrent] = useState("X");
  const [moveForX, setMoveForX] = useState([]);
  const [moveForY, setMoveForY] = useState([]);
  const [winner, setWinner] = useState(null);

  // 检查胜利条件
  const checkWinner = (board) => {
    const winningPatterns = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [2, 0],
        [1, 1],
        [0, 2],
      ],
    ];

    for (let pattern of winningPatterns) {
      const [[x1, y1], [x2, y2], [x3, y3]] = pattern;
      if (
        board[x1][y1] !== "_" &&
        board[x1][y1] === board[x2][y2] &&
        board[x1][y1] === board[x3][y3]
      ) {
        return board[x1][y1]; // 返回胜利者 "X" 或 "O"
      }
    }
    return null;
  };

  // 处理点击事件
  const handlePress = (row, col) => {
    if (board[row][col] !== "_" || winner) {
      Alert.alert(
        "无效操作",
        winner ? `${winner} 已经赢了!` : "该位置已被占用"
      );
      return;
    }

    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((r) => [...r]);
      newBoard[row][col] = current;
      return newBoard;
    });

    if (current === "X") {
      setMoveForX((prevMoves) => {
        const newMoves = [...prevMoves, [row, col]];
        stepLimit(newMoves, setMoveForX);
        return newMoves;
      });
      setCurrent("O");
    } else {
      setMoveForY((prevMoves) => {
        const newMoves = [...prevMoves, [row, col]];
        stepLimit(newMoves, setMoveForY);
        return newMoves;
      });
      setCurrent("X");
    }
  };

  // 监听 board 变化，检查赢家
  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);
      Alert.alert(`X 赢了!`);
    }
  }, [board]);

  // 限制步数，当达到4步时，移除最早的落子
  const stepLimit = (moveList, setMoveList) => {
    if (moveList.length === 4) {
      const [row, col] = moveList[0];
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => [...r]);
        newBoard[row][col] = "_"; // 清除最早的落子
        return newBoard;
      });
      setMoveList(moveList.slice(1));
    }
  };

  // 重置游戏
  const resetGame = () => {
    setBoard(initialBoard);
    setMoveForX([]);
    setMoveForY([]);
    setWinner(null);
    setCurrent("X");
  };

  return (
    <>
      <TouchableOpacity style={styles.headerShown} onPress={resetGame}>
        <Text style={styles.header_text}>Restart</Text>
        <Image style={styles.undo_container} source={icon.undo} />
      </TouchableOpacity>

      <View style={styles.game_container}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.positions}
                onPress={() => handlePress(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {winner && <Text style={styles.winnerText}>X 赢了!</Text>}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  headerShown: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 100,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  header_text: {
    alignSelf: "center",
    fontSize: 25,
    marginRight: 10,
  },
  undo_container: {
    width: 30,
    height: 30,
  },
  game_container: {
    marginTop: 50,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  positions: {
    height: 100,
    width: 100,
    backgroundColor: "#000000",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: "#fff",
    fontSize: 30,
  },
  winnerText: {
    alignSelf: "center",
    fontSize: 30,
    marginTop: 20,
    color: "red",
  },
});
