import { Editor, EditorChange } from "codemirror";
import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import { Controlled as CodeMirror } from "react-codemirror2";
import { CRDTContext } from "../../provider/crdt/crdt";

import "./main.scss";
import { EditorPosition } from "../../provider/crdt/interface";

const Main: React.FC = () => {
  const [text, setText] = React.useState<string>("");

  const { handleLocalInsert, handleLocalDelete, getText } = React.useContext(
    CRDTContext
  );

  const onBeforeChange = (
    editor: Editor,
    data: EditorChange,
    value: string
  ) => {
    console.log(data, value);
    switch (data.origin) {
      case "+input":
        const pos: EditorPosition = { line: data.from.line, ch: data.from.ch };
        const char = handleLocalInsert(data.text, pos);
        break;
      case "+delete":
        const posStart: EditorPosition = {
          line: data.from.line,
          ch: data.from.ch,
        };
        const posEnd: EditorPosition = { line: data.to.line, ch: data.to.ch };
        handleLocalDelete(posStart, posEnd);
        break;
      default:
        break;
    }
    const text$ = getText();
    console.log(text$);
    setText(text$);
  };

  return (
    <div className="editor">
      <CodeMirror onBeforeChange={onBeforeChange} value={text} />
    </div>
  );
};

export default Main;
