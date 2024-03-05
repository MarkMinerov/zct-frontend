import React from "react";
import ReactDOM from "react-dom/client";
import "./reset.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ChakraProvider>
    <React.StrictMode>
      <ToastContainer />
      <App />
    </React.StrictMode>
  </ChakraProvider>
);
