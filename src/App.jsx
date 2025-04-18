import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Loading from "./components/Loading";

const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./pages/Login"));

// const Login = lazy(() => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(import("./pages/Login")), 2000);
//   });
// });

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
