import { Char, EditorPosition } from "../models/SessionModel";

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

const findLine = (char: Char, content: Char[][]) => {
    let leftIndex = 0;
    let rightIndex = content.length - 1;

    if (content.length === 1 || content.length === 0) {
        return 0;
    }

    if (
        compareChars(
            char,
            content[content.length - 1][content[content.length - 1].length - 1]
        ) === 1
    ) {
        return content.length - 1;
    }

    while (leftIndex + 1 < rightIndex) {
        const midLine = Math.floor((rightIndex - leftIndex) / 2) + leftIndex;

        const resStart = compareChars(char, content[midLine][0]);

        if (resStart === 0) {
            return midLine;
        } else if (resStart < 0) {
            rightIndex = midLine;
        } else if (resStart > 0) {
            leftIndex = midLine;
        }
    }

    if (compareChars(char, content[rightIndex][0]) === 1) {
        return rightIndex;
    } else {
        return leftIndex;
    }
};

const findIndexForChar = (char: Char, lineId: number, content: Char[][]) => {
    const line = content[lineId];

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

const findPositionChar = (char: Char, content: Char[][]) => {
    let line = findLine(char, content);
    let ch = findIndexForChar(char, line, content);

    if (
        content[line] &&
        content[line][ch - 1] &&
        content[line][ch - 1].char === "\n"
    ) {
        line += 1;
        ch = 0;
    }
    return { line, ch } as EditorPosition;
};

const insertChar = (char: Char, pos: EditorPosition, content: Char[][]) => {
    if (pos.line === content.length) {
        content.push([]);
    }

    if (char.char === "\n") {
        const lineAfter = content[pos.line].splice(pos.ch);

        if (lineAfter.length === 0) {
            content[pos.line].splice(pos.ch, 0, char);
        } else {
            const lineBefore = content[pos.line].concat(char);
            content.splice(pos.line, 1, lineBefore, lineAfter);
        }
    } else {
        content[pos.line].splice(pos.ch, 0, char);
    }
    return content;
};

const handleInsert = (char: Char, content: Char[][]) => {
    const pos = findPositionChar(char, content);
    return insertChar(char, pos, content);
};

const findPosition = (char: Char, content: Char[][]) => {
    const line = findLine(char, content);
    const ch = findCharInLine(char, line, content);
    return { line, ch };
};

const findCharInLine = (char: Char, lineId: number, content: Char[][]) => {
    const line = content[lineId];

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

const deleteChar = (
    posStart: EditorPosition,
    posEnd: EditorPosition,
    content: Char[][]
) => {
    let char;
    if (posEnd.line !== posStart.line) {
        const chars = content[posEnd.line];

        char = content[posStart.line].splice(posStart.ch, 1)[0];
        content[posStart.line] = content[posStart.line].concat(chars);
        content.splice(posEnd.line, 1);
    } else if (posEnd.line === 0 && posEnd.ch === 0) {
        return content;
    } else {
        char = content[posStart.line].splice(posStart.ch, 1)[0];
    }
    return content;
};

const handleDelete = (char: Char, content: Char[][]) => {
    const pos = findPosition(char, content);
    const pos2: EditorPosition = {
        line: pos.line,
        ch: pos.ch + 1,
    };
    if (content[pos.line + 1] && content[pos.line].length - 1 === pos.ch) {
        pos2.line = pos.line + 1;
        pos2.ch = 0;
    }
    return deleteChar(pos, pos2, content);
};

export default { handleInsert, handleDelete };
