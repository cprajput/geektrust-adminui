import { Box } from "@mui/material";
import React from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="App">
      <Box sx={{ height: "100vh" }}>
        <Dashboard />
      </Box>
    </div>
  );
}

export default App;
