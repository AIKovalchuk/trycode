import { Editor, EditorChange } from "codemirror";
import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import { Controlled as CodeMirror } from "react-codemirror2";

import "./main.scss";

const Main: React.FC = () => {
  const [text, setText] = React.useState<string>("");

  const onBeforeChange = (
    editor: Editor,
    data: EditorChange,
    value: string
  ) => {
    setText(value);
  };

  return (
    <div className="editor">
      <CodeMirror onBeforeChange={onBeforeChange} value={text} />
    </div>
  );
};

export default Main;
