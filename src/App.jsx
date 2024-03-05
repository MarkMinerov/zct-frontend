import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Draw from './pages/Draw';
import Login from './pages/Login';
import Register from './pages/Register';

import Layout from "./layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useCookies } from 'react-cookie';

import "./App.scss";

function App() {
  const [cookies, setCookie] = useCookies(['token']);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="draw" element={<ProtectedRoute cookies={cookies}><Draw /></ProtectedRoute>} />
            <Route path="login" element={<ProtectedRoute publicOnly={true} cookies={cookies}><Login setCookie={setCookie} /></ProtectedRoute>} />
            <Route path="register" element={<ProtectedRoute publicOnly={true} cookies={cookies}><Register setCookie={setCookie} /></ProtectedRoute>} />

            <Route path="*" element={<Navigate replace to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
