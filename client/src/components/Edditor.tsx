import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import { Controlled as ControlledEdditor } from "react-codemirror2";
import { CRDTContext } from "../provider/CRDT";

const Edditor: React.FC = () => {
  const { localInsert, localDelete, getText, debugGetQuque } = React.useContext(
    CRDTContext
  );
  const [value, setValue] = React.useState<string>("");

  const text = getText();
  console.log("DEBUG q:", debugGetQuque());

  const extractChars = (text: string[]) => {
    if (text[0] === "" && text[1] === "" && text.length === 2) {
      return "\n";
    } else {
      return text.join("\n");
    }
  };

  const onBeforeChange = (editor: any, data: any, value$: string) => {
    console.log("DEBUG:", data, "-", value$);

    switch (data.origin) {
      case "+input":
        localInsert(extractChars(data.text), {
          ch: data.from.ch,
          line: data.from.line,
        });
        break;
      case "+delete":
        localDelete(
          { ch: data.from.ch, line: data.from.line },
          { ch: data.to.ch, line: data.to.line }
        );
        break;
      default:
        throw new Error("Unknown operation attempted in editor.");
    }
    setValue(getText());
  };

  return (
    <div>
      <ControlledEdditor value={value} onBeforeChange={onBeforeChange} />
    </div>
  );
};

export default Edditor;
