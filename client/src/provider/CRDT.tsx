import React from "react";
import Char from "../service/Char";
import Position from "../service/Position";

export interface ICRDT {
  localInsert: (value: string, index: Position) => any;
  localDelete: (from: Position, to: Position) => any;
  getText: () => string;
  debugGetQuque: () => string;
}

export const CRDTContext = React.createContext<ICRDT>({
  localInsert: () => undefined,
  localDelete: () => undefined,
  getText: () => "",
  debugGetQuque: () => "",
});

const CRDT: React.FC = ({ children }) => {
  const struct = React.useRef<Char[][]>([[]]);
  const siteId = "qwert";

  const findPosBefore = (pos: Position) => {
    let ch = pos.ch;
    let line = pos.line;

    if (ch === 0 && line === 0) {
      return [];
    } else if (ch === 0 && line !== 0) {
      line = line - 1;
      ch = struct.current[line].length;
    }

    return struct.current[line][ch - 1].position;
  };

  const findPosAfter = (pos: Position) => {
    let ch = pos.ch;
    let line = pos.line;

    const numLines = struct.current.length;
    const numChars = (struct.current[line] && struct.current[line].length) || 0;

    if (line === numLines - 1 && ch === numChars) {
      return [];
    } else if (line < numLines - 1 && ch === numChars) {
      line = line + 1;
      ch = 0;
    } else if (line > numLines - 1 && ch === 0) {
      return [];
    }

    return struct.current[line][ch].position;
  };

  const localInsert = (value: string, pos: Position) => {
    console.log("DEBUG localInsert:", value, "-", pos);
    const char: any = generateCharStruct(value, pos);

    if (pos.line === struct.current.length) {
      struct.current.push([]);
    }

    // if inserting a newline, split line into two lines
    if (char.value === "\n") {
      const lineAfter = struct.current[pos.line].splice(pos.ch);

      if (lineAfter.length === 0) {
        struct.current[pos.line].splice(pos.ch, 0, char);
      } else {
        const lineBefore = struct.current[pos.line].concat(char);
        struct.current.splice(pos.line, 1, lineBefore, lineAfter);
      }
    } else {
      struct.current[pos.line].splice(pos.ch, 0, char);
    }
    return char;
  };

  const localDelete = (from: Position, to: Position) => {
    if (from.ch === 0 && from.line === 0 && to.ch === 0 && to.line === 0) {
      return;
    } else if (to.ch === 0 && from.line === to.line - 1) {
      const char = struct.current[from.line].splice(
        struct.current[from.line].length - 1,
        1
      )[0];
      struct.current = struct.current.filter((line) => line.length !== 0);
      return char;
    } else {
      return struct.current[from.line].splice(from.ch, 1)[0];
    }
  };

  const remoteInsert = (char: Char) => {
    const remotePos = char.position;

    for (let deep = 0; deep < remotePos.length; deep++) {
      struct.current.forEach((char$) => char$);
    }
  };

  const remoteDelete = (char: Char) => {};

  const generateCharStruct = (char: string, pos: Position) => {
    const posBefore = findPosBefore(pos);
    const posAfter = findPosAfter(pos);
    console.log("posBefore", posBefore, "posAfter", posAfter);
    const newPos = generatePosBetween(posBefore, posAfter);
    console.log("newPos", newPos);
    return new Char(char, siteId, newPos);
  };

  const generatePosBetween = (
    posBefore: number[],
    posAfter: number[],
    newPos: number[] = []
  ): any => {
    const id1 = posBefore[0] || 0;
    const id2 = posAfter[0] || 9;

    if (id2 - id1 > 1) {
      const digit = Math.floor(Math.random() * (id2 - id1)) + id1;
      newPos.push(digit);
      return newPos;
    } else if (id2 - id1 === 1) {
      newPos.push(id1);
      return generatePosBetween(posBefore.slice(1), posAfter, newPos);
    } else if (id2 === id1) {
      newPos.push(id1);
      return generatePosBetween(posBefore.slice(1), posAfter.slice(1), newPos);
    }
  };

  const getText = () => {
    return (
      struct.current
        ?.map((line) => line.map((char) => char.value).join(""))
        .join("") || ""
    );
  };

  const debugGetQuque = () => {
    return (
      struct.current.map((line) =>
        line
          .map((char) => ` |${char.value} ${char.position.join(",")}| `)
          .join("")
      ) || ""
    );
  };

  return (
    <CRDTContext.Provider
      value={{
        localInsert,
        localDelete,
        getText,
        debugGetQuque,
      }}
    >
      {children}
    </CRDTContext.Provider>
  );
};

export default CRDT;
