import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from 'Pages/Login';
import SignUpPage from 'Pages/SignUp';

function AppRoutes() {
  return (
    <div className="App">
      <BrowserRouter>
        
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AppRoutes;
