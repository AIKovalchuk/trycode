import { Editor, EditorChange } from "codemirror";
import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import { Controlled as CodeMirror } from "react-codemirror2";
import CRDT, { CRDTContext } from "../../provider/crdt/crdt";
import { EditorPosition } from "../../provider/crdt/interface";
import { Users } from "./users";
import { SessionFull } from "../../service/Session";

import "./editor.scss";

interface Props {
  session: SessionFull;
}

const Edditor: React.FC<Props> = ({ session }) => {
  const { handleLocalInsert, handleLocalDelete, text } =
    React.useContext(CRDTContext);

  const onBeforeChange = (
    editor: Editor,
    data: EditorChange,
    value: string
  ) => {
    console.log("INPUT", "data: ", data, "value: ", value);
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
  };

  return (
    <div className="editor">
      <CodeMirror
        onBeforeChange={onBeforeChange}
        value={text}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          theme: "material",
          mode: session.type,
          lineNumbers: true,
        }}
      />
      <Users />
    </div>
  );
};

export default Edditor;
