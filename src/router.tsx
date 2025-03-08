import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import CreacionComprimido from "./pages/CreacionComprimido/CreacionComprimido";
import Solicitudes from "./pages/Solicitudes/Solicitudes";
import Contact from "./pages/Contact/Contact";
import Pokemones from "./pages/Pokemones/Pokemones";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'pokemones',
        element: <Pokemones />,
      },
      {
        path: 'solicitudes',
        element: <Solicitudes />,
      },
      {
        path: 'creacioncomprimido',
        element: <CreacionComprimido />,
      },
    ],
  },
])