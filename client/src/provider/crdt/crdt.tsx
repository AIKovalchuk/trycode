import React from "react";
import { Char, EditorPosition } from "./interface";

interface CRDTController {
  handleLocalInsert: (value: string[], pos: EditorPosition) => Char;
  handleLocalDelete: (pos: EditorPosition, posEnd: EditorPosition) => void;
  handleRemoteInsert: () => void;
  handleRemoteDelete: () => void;
  getText: () => string;
}

export const CRDTContext = React.createContext<CRDTController>({
  handleLocalInsert: (value: string[], pos: EditorPosition) => {
    return {} as Char;
  },
  handleLocalDelete: (pos: EditorPosition, posEnd: EditorPosition) => undefined,
  handleRemoteInsert: () => undefined,
  handleRemoteDelete: () => undefined,
  getText: () => "",
});

const CRDT: React.FC = ({ children }) => {
  const charsRef = React.useRef<Char[][]>([[]]);

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
    return char;
  };

  const handleLocalDelete = (
    posStart: EditorPosition,
    posEnd: EditorPosition
  ) => {
    if (posEnd.line !== posStart.line) {
      const chars = charsRef.current[posEnd.line];
      charsRef.current[posStart.line].splice(posStart.ch, 1);
      charsRef.current[posStart.line].concat(chars);
    } else if (posStart.line === 0 && posStart.ch === 0) {
      return;
    } else {
      charsRef.current[posStart.line].splice(posStart.ch, 1);
    }
    charsRef.current = charsRef.current.filter((line) => line.length !== 0);
  };

  const handleRemoteInsert = () => {
    return undefined;
  };

  const handleRemoteDelete = () => {
    return undefined;
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
        getText,
      }}
    >
      {children}
    </CRDTContext.Provider>
  );
};

export default CRDT;
