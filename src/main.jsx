import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App";


let client = new Date();
let server;

setTimeout(() => {
    console.log("Checking server time...")
}, 800);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App
            composition="learn React JS"
            client={client}
            server="3"
        />
    </StrictMode>
);