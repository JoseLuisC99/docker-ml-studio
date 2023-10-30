import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { DockerMuiThemeProvider } from "@docker/docker-mui-theme";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Landing } from "./Landing";
import { Studio } from "./Studio";

const router = createBrowserRouter([
  {path: "/", element: <Landing />},
  {path: "/studio", element: <Studio />}
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DockerMuiThemeProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </DockerMuiThemeProvider>
  </React.StrictMode>
);
