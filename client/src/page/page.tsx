import React from "react";
import Header from "../components/header/Header";

export const Page: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
