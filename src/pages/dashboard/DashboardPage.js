import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import './dashboard.css'; 
import { MdMood, MdOutlineEnergySavingsLeaf, MdAdjust,MdOutlineThumbUp  } from "react-icons/md";
import { FaTasks, FaClock } from "react-icons/fa";
import Feedback from '../../components/feeback/Feedback';

const DashboardPage = () => {
  const [completedTasks, setCompletedTasks] = useState(5); // Replace with actual data
  const [totalWorkTime, setTotalWorkTime] = useState(300); // Total work time in minutes
  const [wellnessData, setWellnessData] = useState({
    wellbeing: 4, // Out of 10
    energy: 2, // Out of 10
    mood: 1,
    ambition:3
  });

  useEffect(() => {
    // Fetch actual data from backend or state management
    setCompletedTasks(4)
    setTotalWorkTime(3)
    setWellnessData({
      wellbeing:4,
      mood:3,
      ambition:5,
      energy:2
    })
  }, []);

  return (
    <div className="dashboard-container">
      <Typography variant="h3" className="dashboard-title">
        Performance and Rating
      </Typography>

      <Box className="dashboard-section">
        {/*  
          * Work Performance Section
        */}
        <Paper className="dashboard-card" elevation={3}>
          <Typography variant="h5">Work Performance</Typography>
          <div>
            <FaTasks />
            <Typography variant="body1">
              Tasks Completed Today: {completedTasks}
            </Typography>
          </div>
          <div>
            <FaClock />
            <Typography variant="body1">
              Total Work Time: {Math.floor(totalWorkTime / 60)} hours {totalWorkTime % 60} minutes
            </Typography>
          </div>
        </Paper>

        {/* 
          * Wellness Data Section
         */}
        <Paper className="dashboard-card" elevation={3}>
          <Typography variant="h5">Wellness Check-in</Typography>
          <div>
            <MdOutlineThumbUp />
            <Typography variant="body1">
              Well-being Rating: {wellnessData.wellbeing} / 5
            </Typography>
          </div>
          <div>
            <MdOutlineEnergySavingsLeaf />
            <Typography variant="body1">
              Energy Rating: {wellnessData.energy} / 5
            </Typography>
          </div>
          <div>
            <MdMood />
            <Typography variant="body1">
              Mood Rating: {wellnessData.mood} / 5
            </Typography>
          </div>
          <div>
            <MdAdjust />
            <Typography variant="body1">
              Ambition Rating: {wellnessData.ambition} / 5
            </Typography>
          </div>
        </Paper>
        <Feedback/>
      </Box>
    </div>
  );
};

export default DashboardPage;
