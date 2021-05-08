import React from "react";
import Main from "../../page/main/main";
import { Char, EditorPosition } from "./interface";
import { io, Socket } from "socket.io-client";

interface CRDTController {
  handleLocalInsert: (value: string[], pos: EditorPosition) => Char;
  handleLocalDelete: (pos: EditorPosition, posEnd: EditorPosition) => void;
  handleRemoteInsert: (char: Char) => void;
  handleRemoteDelete: (char: Char) => void;
  text: string;
}

export const CRDTContext = React.createContext<CRDTController>({
  handleLocalInsert: () => {
    return {} as Char;
  },
  handleLocalDelete: () => undefined,
  handleRemoteInsert: () => undefined,
  handleRemoteDelete: () => undefined,
  text: "",
});

const CRDT: React.FC = ({ children }) => {
  const charsRef = React.useRef<Char[][]>([[]]);
  const [text, setText] = React.useState("");
  const socket = React.useRef<Socket>();

  React.useEffect(() => {
    socket.current = io("http://localhost:8080");

    socket.current.on("remote-insert", (char: Char) => {
      console.log("remote-insert", char);
      handleRemoteInsert(char);
    });

    socket.current.on("remote-delete", (char: Char) => {
      console.log("remote-delete", char);
      handleRemoteDelete(char);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  const compareChars = (charA: Char, charB: Char) => {
    console.log("Compare", charA, charB);
    const length = Math.min(charA.position.length, charB.position.length);
    for (let deep = 0; deep < length; deep++) {
      if (charA.position[deep] > charB.position[deep]) {
        return 1;
      } else if (charA.position[deep] < charB.position[deep]) {
        return -1;
      } else if (
        charA.position[deep] === charB.position[deep] &&
        deep === length - 1 &&
        length !== Math.max(charA.position.length, charB.position.length)
      ) {
        if (charA.position.length < charB.position.length) {
          return -1;
        } else {
          return 1;
        }
      } else if (
        charA.position[deep] === charB.position[deep] &&
        deep === length - 1
      ) {
        return 0;
      }
    }
    return 0;
  };

  const findPosBetween = (
    posBefore: number[],
    posAfter: number[],
    newPos: number[] = []
  ): number[] => {
    const firstInd = posBefore[0] || 0;
    const secondInd = posAfter[0] || firstInd * 10 + 2;

    if (secondInd - firstInd > 1) {
      const digit = Math.floor(Math.random() * secondInd + firstInd + 1);
      newPos.push(digit);
      return newPos;
    } else if (secondInd - firstInd === 1) {
      newPos.push(firstInd);
      return findPosBetween(posBefore.slice(1), [], newPos);
    } else if (firstInd === secondInd) {
      newPos.push(firstInd);
      return findPosBetween(posBefore.slice(1), posAfter.slice(1), newPos);
    }
    return [];
  };

  const findPosBefore = (pos: EditorPosition) => {
    const ch = pos.ch;
    const line = pos.line;

    if (ch === 0 && line === 0) {
      return [];
    } else if (ch === 0 && line !== 0) {
      const lengthOfLineBefore = charsRef.current[line - 1].length;
      const posBef =
        charsRef.current[line - 1][lengthOfLineBefore - 1].position;
      return posBef;
    } else {
      const posBef = charsRef.current[line][ch - 1].position;
      return posBef;
    }
  };

  const findPosAfter = (pos: EditorPosition) => {
    let ch = pos.ch;
    let line = pos.line;

    const countOflines = charsRef.current.length;
    const lengthOfLine =
      (charsRef.current[line] && charsRef.current[line].length) || 0;

    if (line === countOflines - 1 && lengthOfLine === ch) {
      return [];
    } else if (line < countOflines - 1 && ch === lengthOfLine) {
      line += 1;
      ch = 0;
    } else if (line > countOflines - 1 && ch === 0) {
      return [];
    }

    const posAfter = charsRef.current[line][ch].position;
    return posAfter;
  };

  const generateChar = (value: string, pos: EditorPosition) => {
    const posBefore = findPosBefore(pos);
    const posAfter = findPosAfter(pos);
    const newPos = findPosBetween(posBefore, posAfter);

    const char: Char = { char: value, position: newPos };
    return char;
  };

  const insertChar = (char: Char, pos: EditorPosition) => {
    if (pos.line === charsRef.current.length) {
      charsRef.current.push([]);
    }

    if (char.char === "\n") {
      const lineAfter = charsRef.current[pos.line].splice(pos.ch);

      if (lineAfter.length === 0) {
        charsRef.current[pos.line].splice(pos.ch, 0, char);
      } else {
        const lineBefore = charsRef.current[pos.line].concat(char);
        charsRef.current.splice(pos.line, 1, lineBefore, lineAfter);
      }
    } else {
      charsRef.current[pos.line].splice(pos.ch, 0, char);
    }
  };

  const handleLocalInsert = (value: string[], pos: EditorPosition) => {
    let charInsert = value[0];
    if (value[0] === "" && value[1] === "" && value.length === 2) {
      charInsert = "\n";
      // pos.line += 1;
      // pos.ch = 0;
    }
    const char = generateChar(charInsert, pos);
    insertChar(char, pos);
    updateText();
    socket.current?.emit("insert-char", char);
    return char;
  };

  const handleLocalDelete = (
    posStart: EditorPosition,
    posEnd: EditorPosition
  ) => {
    let char;
    if (posEnd.line !== posStart.line) {
      const chars = charsRef.current[posEnd.line];
      charsRef.current[posStart.line].splice(posStart.ch, 1);
      charsRef.current[posStart.line].concat(chars);
    } else if (posStart.line === 0 && posStart.ch === 0) {
      return;
    } else {
      char = charsRef.current[posStart.line].splice(posStart.ch, 1);
    }
    charsRef.current = charsRef.current.filter((line) => line.length !== 0);
    updateText();
    socket.current?.emit("delete-char", char);
  };

  const findPositionChar = (char: Char) => {
    const line = findLine(char);
    const ch = findIndexForChar(char, line);

    return { line, ch } as EditorPosition;
  };

  const handleRemoteInsert = (char: Char) => {
    const pos = findPositionChar(char);
    insertChar(char, pos);
    updateText();
    return undefined;
  };

  const findLine = (char: Char) => {
    console.log("TEST findLine", char, charsRef.current);
    const target = char.position[0];

    let leftIndex = 0;
    let rightIndex = charsRef.current.length - 1;

    if (charsRef.current.length === 1) {
      return 0;
    }

    while (leftIndex <= rightIndex) {
      const midLine = Math.floor((rightIndex - leftIndex) / 2) + leftIndex;

      if (
        charsRef.current[midLine][0].position[0] <= target &&
        target <=
          charsRef.current[midLine][charsRef.current[midLine].length - 1]
            .position[0]
      ) {
        return midLine;
      } else if (charsRef.current[midLine][0].position[0] >= target) {
        rightIndex = midLine;
      } else {
        leftIndex = rightIndex;
      }
    }
    return -1;
  };

  const findCharInLine = (char: Char, lineId: number) => {
    console.log(
      "TEST findCharInLine",
      char,
      lineId,
      charsRef.current,
      charsRef.current[lineId]
    );
    const line = charsRef.current[lineId];

    let leftIndex = 0;
    let rightIndex = line.length - 1;

    while (leftIndex <= rightIndex) {
      console.log("TEST findCharInLine", leftIndex, rightIndex);
      const midChar = Math.floor((rightIndex - leftIndex) / 2) + leftIndex;

      for (let deep = 0; deep < line[midChar].position.length; deep++) {
        console.log(
          "TEST findCharInLine",
          midChar,
          deep,
          line[midChar].position[deep],
          char.position[deep]
        );
        if (line[midChar].position[deep] > char.position[deep]) {
          rightIndex = midChar;
        } else if (line[midChar].position[deep] < char.position[deep]) {
          leftIndex = midChar;
        } else if (
          line[midChar].position[deep] === char.position[deep] &&
          deep === char.position.length - 1
        ) {
          return midChar;
        }
      }
    }
    return -1;
  };

  const findIndexForChar = (char: Char, lineId: number) => {
    console.log("TEST findIndexForChar 1", char, lineId);
    const line = charsRef.current[lineId];

    if (line.length === 0) {
      return 0;
    }

    let leftIndex = 0;
    let rightIndex = line.length - 1;

    if (line.length === 0 || compareChars(char, line[leftIndex]) < 0) {
      return leftIndex;
    } else if (compareChars(char, line[rightIndex]) > 0) {
      return line.length;
    }

    while (leftIndex <= rightIndex) {
      console.log("TEST findIndexForChar 2", leftIndex, rightIndex);
      const midChar = Math.floor((rightIndex - leftIndex) / 2) + leftIndex;

      const res = compareChars(char, line[midChar]);
      console.log("TEST findIndexForChar 3", res, midChar);
      if (res === -1) {
        rightIndex = midChar;
      } else if (res === 1) {
        leftIndex = midChar;
      } else {
        return midChar;
      }
      if (leftIndex === rightIndex) {
        break;
      }
    }
    console.log(char, line[leftIndex], line, leftIndex, rightIndex);
    if (compareChars(char, line[leftIndex]) === 0) {
      return leftIndex;
    } else {
      return rightIndex;
    }
  };

  const findPosition = (char: Char) => {
    const line = findLine(char);
    const ch = findCharInLine(char, line);

    return { line, ch };
  };

  const handleRemoteDelete = (char: Char) => {
    const pos = findPosition(char);
    handleLocalDelete(pos, { line: pos.line, ch: pos.ch + 1 });
    updateText();
  };

  // React.useEffect(() => {
  //   console.log("TEST");
  //   setTimeout(() => {
  //     console.log("TEST START");
  //     const char = charsRef.current[1][2];
  //     const char2 = { char: "p", position: [9999] } as Char;
  //     console.log(char);
  //     // handleRemoteDelete(char);
  //     handleRemoteInsert(char2);
  //     console.log("TEST END");
  //   }, 10000);
  // }, []);

  const updateText = () => {
    setText((state) => getText());
  };

  const getText = () => {
    return charsRef.current
      .map((line) => line.map((ch) => ch.char).join(""))
      .join("");
  };

  return (
    <CRDTContext.Provider
      value={{
        handleLocalInsert,
        handleLocalDelete,
        handleRemoteInsert,
        handleRemoteDelete,
        text,
      }}
    >
      {children}
    </CRDTContext.Provider>
  );
};

export default CRDT;
