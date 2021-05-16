import React from "react";
import Main from "../../page/editor/editor";
import { Char, EditorPosition } from "./interface";
import { io, Socket } from "socket.io-client";
import { NetworkContext } from "../network/network";

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
  // const socket = React.useRef<Socket>();
  const { socket } = React.useContext(NetworkContext);

  const compareChars = (charA: Char, charB: Char) => {
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

  const generateDigit = (min: number, max: number) => {
    min += 1;
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const findPosBetween = (
    posBefore: number[],
    posAfter: number[],
    newPos: number[] = []
  ): number[] => {
    const firstInd = posBefore.length ? posBefore[0] : 0;

    const secondInd = posAfter.length ? posAfter[0] : 32;

    if (secondInd - firstInd > 1) {
      const digit = generateDigit(firstInd, secondInd);
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

    // const countOflines = charsRef.current.length;
    const lengthOfLine =
      (charsRef.current[line] && charsRef.current[line].length) || 0;

    // check last symbol on this line and its new symbol in end of string
    if (ch === lengthOfLine && charsRef.current[line + 1]) {
      line += 1;
      ch = 0;
    } else if (
      (ch === lengthOfLine && !charsRef.current[line + 1]) ||
      !charsRef.current[line] ||
      (charsRef.current[line] && ch === lengthOfLine)
    ) {
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

  const findPositionChar = (char: Char) => {
    let line = findLine(char);
    let ch = findIndexForChar(char, line);

    if (
      charsRef.current[line] &&
      charsRef.current[line][ch - 1] &&
      charsRef.current[line][ch - 1].char === "\n"
    ) {
      line += 1;
      ch = 0;
    }
    return { line, ch } as EditorPosition;
  };

  const findLine = (char: Char) => {
    let leftIndex = 0;
    let rightIndex = charsRef.current.length - 1;

    if (charsRef.current.length === 1 || charsRef.current.length === 0) {
      return 0;
    }

    if (
      compareChars(
        char,
        charsRef.current[charsRef.current.length - 1][
          charsRef.current[charsRef.current.length - 1].length - 1
        ]
      ) === 1
    ) {
      return charsRef.current.length - 1;
    }

    while (leftIndex + 1 < rightIndex) {
      const midLine = Math.floor((rightIndex - leftIndex) / 2) + leftIndex;

      const resStart = compareChars(char, charsRef.current[midLine][0]);

      if (resStart === 0) {
        return midLine;
      } else if (resStart < 0) {
        rightIndex = midLine;
      } else if (resStart > 0) {
        leftIndex = midLine;
      }
    }

    if (compareChars(char, charsRef.current[rightIndex][0]) === 1) {
      return rightIndex;
    } else {
      return leftIndex;
    }
  };

  const findCharInLine = (char: Char, lineId: number) => {
    const line = charsRef.current[lineId];

    let leftIndex = 0;
    let rightIndex = line.length - 1;

    while (leftIndex + 1 < rightIndex) {
      const midChar = Math.floor((rightIndex - leftIndex) / 2) + leftIndex;

      const res = compareChars(char, line[midChar]);
      if (res === -1) {
        rightIndex = midChar;
      } else if (res === 1) {
        leftIndex = midChar;
      } else {
        return midChar;
      }
    }
    if (compareChars(char, line[leftIndex]) === 0) {
      return leftIndex;
    } else {
      return rightIndex;
    }
  };

  const findIndexForChar = (char: Char, lineId: number) => {
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

    while (leftIndex + 1 < rightIndex) {
      const midChar = Math.floor((rightIndex - leftIndex) / 2) + leftIndex;

      const res = compareChars(char, line[midChar]);
      if (res === -1) {
        rightIndex = midChar;
      } else if (res === 1) {
        leftIndex = midChar;
      } else {
        return midChar;
      }
    }

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

  const updateText = () => {
    setText((state) => getText());
  };

  const deleteChar = (posStart: EditorPosition, posEnd: EditorPosition) => {
    let char;
    if (posEnd.line !== posStart.line) {
      const chars = charsRef.current[posEnd.line];

      char = charsRef.current[posStart.line].splice(posStart.ch, 1)[0];
      charsRef.current[posStart.line] =
        charsRef.current[posStart.line].concat(chars);
      charsRef.current.splice(posEnd.line, 1);
    } else if (posEnd.line === 0 && posEnd.ch === 0) {
      console.log("deleteChar nothing", posStart, posEnd);
      return;
    } else {
      char = charsRef.current[posStart.line].splice(posStart.ch, 1)[0];
    }

    updateText();
    return char;
  };

  const handleLocalInsert = (value: string[], pos: EditorPosition) => {
    let charInsert = value[0];
    if (value[0] === "" && value[1] === "" && value.length === 2) {
      charInsert = "\n";
    }
    const char = generateChar(charInsert, pos);
    insertChar(char, pos);
    updateText();
    socket?.emit("insert-char", char);
    return char;
  };

  const handleLocalDelete = (
    posStart: EditorPosition,
    posEnd: EditorPosition
  ) => {
    console.log("handleLocalDelete ", posStart, posEnd);
    const char = deleteChar(posStart, posEnd);
    socket?.emit("delete-char", char);
  };

  const handleRemoteInsert = React.useCallback((char: Char) => {
    console.log("handleRemoteInsert", char);
    if (char === null) return;
    const pos = findPositionChar(char);
    console.log("handleRemoteInsert pos", pos);
    insertChar(char, pos);
    updateText();
    return undefined;
  }, []);

  const handleRemoteDelete = React.useCallback((char: Char) => {
    console.log("handleRemoteDelete", char);
    if (char === null) return;
    const pos = findPosition(char);
    const pos2: EditorPosition = {
      line: pos.line,
      ch: pos.ch + 1,
    };
    if (
      charsRef.current[pos.line + 1] &&
      charsRef.current[pos.line].length - 1 === pos.ch
    ) {
      pos2.line = pos.line + 1;
      pos2.ch = 0;
    }
    console.log("handleRemoteDelete pos", pos, pos2);
    deleteChar(pos, pos2);
  }, []);

  const getText = () => {
    return charsRef.current
      .map((line) => line.map((ch) => ch.char).join(""))
      .join("");
  };

  React.useEffect(() => {
    socket?.on("remote-insert", (char: Char) => {
      console.log("remote-insert", char);
      handleRemoteInsert(char);
    });

    socket?.on("remote-delete", (char: Char) => {
      console.log("remote-delete", char);
      handleRemoteDelete(char);
    });
    console.log(socket);
  }, [handleRemoteDelete, handleRemoteInsert, socket]);

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
