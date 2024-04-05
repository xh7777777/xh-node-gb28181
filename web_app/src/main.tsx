import React from "react";
import ReactDOM from "react-dom/client";
import "./css/tailwind.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index";
import configureStore from "./store/configure.ts";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={configureStore}>
      <ConfigProvider theme={{
        components: {
          Menu: {
            darkItemBg: '#818cf8',
            darkItemColor: '#fff',
            darkItemSelectedBg: '#818cf8',
            darkItemHoverBg: '#818cf8',
            itemBg: '#818cf8',
            itemSelectedBg: '#818cf8',
            itemHeight: 80,
          },
        }
      }}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
