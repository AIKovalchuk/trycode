import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import { Controlled as ControlledEdditor } from "react-codemirror2";
import { CRDTContext } from "../provider/CRDT";

const Edditor: React.FC = () => {
  const CRTD = React.useContext(CRDTContext);
  const [value, setValue] = React.useState<string>("");

  const onBeforeChange = (editor: any, data: any, value$: string) => {
    console.log("DEBUG:", data, "-", value$);
    switch (data.origin) {
      case "+input":
        console.log("DEBUG:", "");
        CRTD.onInsert(data.text[0], 0);
        break;
      case "+delete":
        console.log("DEBUG:", "+delete");
        break;
      default:
        throw new Error("Unknown operation attempted in editor.");
    }
    setValue(value$);
  };

  return (
    <div>
      <ControlledEdditor value={value} onBeforeChange={onBeforeChange} />
    </div>
  );
};

export default Edditor;
