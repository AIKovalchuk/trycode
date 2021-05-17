import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./provider/auth/Auth";
import Routing from "./routing";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routing />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
