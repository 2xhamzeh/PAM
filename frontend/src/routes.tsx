import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import About from "./pages/About";
import { LogIn } from "./pages/LogIn.tsx";
import { KeinZugriff } from "./pages/KeinZugriff.tsx";
import MainLayout from "./pages/MainLayout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { Error404 } from "./pages/Error404.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LogIn />
    },
    {
        element: <ProtectedRoute component={MainLayout} />,
        children: [
            {
                path: "/home",
                index: true,
                element: <HomePage />
            },
            {
                path: "/about",
                element: <About />
            }
        ]
    },
    {
        path: "/no-access",
        element: <KeinZugriff />
    },
    {
        path: "*",
        element: <Error404 />
    }

]);