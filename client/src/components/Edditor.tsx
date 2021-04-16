import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import { Controlled as ControlledEdditor } from "react-codemirror2";

const Edditor: React.FC = () => {
  const [value, setValue] = React.useState<string>("");

  const handleChange = (editor: string, data: string, value$: string) => {
    setValue(value$);
  };

  console.log("DEBUG:", value);

  return (
    <div>
      <ControlledEdditor value={value} onBeforeChange={handleChange} />
    </div>
  );
};

export default Edditor;
