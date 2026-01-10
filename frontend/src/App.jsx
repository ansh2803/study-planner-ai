import React from 'react'
import Dashboard from './pages/Dashboard'
import GeneratePlan from './pages/GeneratePlan'
import { useState } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate,useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'



const App = () => {
  const [refresh, setRefresh] = useState(false);
  const location = useLocation();
   // Pages where navbar should NOT appear
  const hideNavbarRoutes = ["/login", "/signup"];
  return (
    <>
     {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
    
    
    {/* <GeneratePlan onPlanGenerated={() => setRefresh(!refresh)} />
    <hr />
     <Dashboard key={refresh}/> */}
     <Routes>
     {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/generate" />} />
        <Route path="/generate" element={<ProtectedRoute><GeneratePlan /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard key={refresh} /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
