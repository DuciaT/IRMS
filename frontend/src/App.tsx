import { RouterProvider } from "react-router-dom";
import { router } from "./route/routes";
import { Toaster } from "./components/feedback/Toaster";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}