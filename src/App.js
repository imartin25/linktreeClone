import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './loginpage';
import AdminPage from './adminpage';
import { Routes, Route } from "react-router-dom"
import UserPage from './userpage';

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={isAuthenticated ? (
            <AdminPage />
          ) : (
            <LoginPage />
          )} />
          <Route path="/:userName" element={<UserPage />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
