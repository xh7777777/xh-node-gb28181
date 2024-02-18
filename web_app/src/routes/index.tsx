import {
    createBrowserRouter,
  } from "react-router-dom";
import Root from "./root";
import ErrorPage from "./error-page";

export default createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: []
    },

]);