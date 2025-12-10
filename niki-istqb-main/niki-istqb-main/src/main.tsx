import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Quiz from "./Quiz.tsx";
import "./index.css";

const router = createBrowserRouter(
  [
    { path: "/", element: <App /> },
    { path: "/quiz", element: <Quiz /> },
  ],
  {
    basename: "/niki-istqb",
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
