import {
    createBrowserRouter,
  } from "react-router-dom";
import Root from "../pages/root";
import Device from "../pages/Device";
import User from "../pages/User";
import Config from "../pages/Config";
import ErrorPage from "./error-page";
import Login from "../pages/Login";
import DeviceChannel from "../pages/DeviceChannel";
import Main from "../pages/Main";

export default createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Main />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/device",
                element: <Device />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "/device/channel",
                        element: <DeviceChannel />,
                        errorElement: <ErrorPage />,
                    }
                ]
            },
            {
                path: "/user",
                element: <User />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/config",
                element: <Config />,
                errorElement: <ErrorPage />,
            },
        ]
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
    }

]);