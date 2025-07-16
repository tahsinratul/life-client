import {createBrowserRouter} from "react-router";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import HomePage from "../Pages/HomePage";




const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children:[
    {
        path:"/",
        Component: HomePage
    },
    {
        path:"/login",
        Component: LoginPage
    },
    {
        path:"/register",
        Component: RegisterPage
    }
]
  },
]);


export default router