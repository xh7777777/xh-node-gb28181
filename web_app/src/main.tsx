import React from "react";
import ReactDOM from "react-dom/client";
import "./css/tailwind.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index";
import configureStore from "./store/configure.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={configureStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
