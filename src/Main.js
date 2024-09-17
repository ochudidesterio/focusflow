import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar/NavBar';
import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import WorkBreakTimer from './pages/timer/WorkBreakTimer';


const Main = () => {
  return (
    <div>
    <Router>
    <NavBar/>

      <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route exact path="/dashboard" element={<DashboardPage/>} />
          <Route exact path="/timer" element={<WorkBreakTimer/>} />
        </Routes>
      </Router>

    </div>
  )
}

export default Main