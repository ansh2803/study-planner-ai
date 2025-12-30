import React from 'react'
import Dashboard from './pages/Dashboard'
import GeneratePlan from './pages/GeneratePlan'
import { useState } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom';


const App = () => {
  const [refresh, setRefresh] = useState(false);
  return (
    <>
    <Navbar />
    {/* <GeneratePlan onPlanGenerated={() => setRefresh(!refresh)} />
    <hr />
     <Dashboard key={refresh}/> */}
     <Routes>
        <Route path="/" element={<Navigate to="/generate" />} />
        <Route path="/generate" element={<GeneratePlan />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
