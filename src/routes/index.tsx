import { createBrowserRouter } from "react-router-dom";
import FormDatas from "../pages/FormDatas";
export const router = createBrowserRouter([
  {
    path: "",
    // element: <TodoApp />,
    element: <FormDatas />,
  },
]);
