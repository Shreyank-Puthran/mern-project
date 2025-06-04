import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme.js";
import { Navbar, SideBar } from "./scenes/index.js";
import { Outlet } from "react-router-dom";
import api from "../api/axios.js"

export const ToggledContext = createContext(null);

function AdminApp() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  async function testBackendConnection() {
    try {
      const response = await api.get("/test"); // Adjust path if needed
      console.log("Backend response:", response.data);
    } catch (error) {
      console.error("Backend connection error:", error);
    }
  }
  // console.log("API URL:", import.meta.env.VITE_API_URL);
  testBackendConnection();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
            <SideBar />
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxWidth: "100%",
              }}
            >
              <Navbar />
              <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminApp;
