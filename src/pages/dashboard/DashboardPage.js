import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import dayjs from 'dayjs';
import { MdMood, MdOutlineEnergySavingsLeaf, MdAdjust, MdOutlineThumbUp } from "react-icons/md";
import { FaTasks, FaClock } from "react-icons/fa";
import Feedback from '../../components/feeback/Feedback';
import './dashboard.css';
import api from '../../api/api';
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/userSlice';
import Toast, { showToast } from '../../components/toast/Toast';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [wellnessData, setWellnessData] = useState({
    wellbeing: 1,
    energy: 1,
    mood: 1,
    ambition: 1
  });

  const user = useSelector(getUser);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Fetch data based on the selected date
  useEffect(() => {
    const fetchCheckinData = async () => {
      const formattedDate = selectedDate.format('YYYY-MM-DD');

      const response = await api.get(`checkins/${user.id}/date/${formattedDate}`);
      const res = await api.get(`/task/user/${user.id}/date/${formattedDate}`);

      if (response.data.data !== null) {
        setWellnessData(response.data.data);
      } else {
        showToast("No data for this day", "error");
        setWellnessData({
          wellbeing: 0,
          energy: 0,
          mood: 0,
          ambition: 0
        });
      }

      if (res.data.data !== null) {
        setPerformanceData(res.data.data);
        calculateTotalTimeSpent(res.data.data);
      }
    };

    fetchCheckinData();
  }, [selectedDate, user.id]);

  const calculateTotalTimeSpent = (data) => {
    const totalTimeInSeconds = data.reduce((acc, task) => acc + task.timespent, 0);
    const totalTimeInMinutes = Math.floor(totalTimeInSeconds / 60);
    setTotalTimeSpent(totalTimeInMinutes);
  };

  // Line chart data for wellness
  const lineChartData = {
    labels: ['Well-being', 'Energy', 'Mood', 'Ambition'],
    datasets: [
      {
        label: 'Wellness Ratings',
        data: [wellnessData.wellbeing, wellnessData.energy, wellnessData.mood, wellnessData.ambition],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Wellness Ratings Overview',
      },
    },
  };

  return (
    <div className="dashboard-container">
      <Toast />
      <Typography variant="h3" className="dashboard-title">
        Performance and Rating
      </Typography>

      {/* Wrap the date picker in LocalizationProvider */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Date Picker to select the date */}
        <Box className="date-picker-container" sx={{ mb: 4, marginTop: 5 }}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </LocalizationProvider>

      <Box className="dashboard-section">
        {/* Work Performance Section */}
        <Paper className="dashboard-card" elevation={3}>
          <Typography variant="h5">Work Performance</Typography>
          <div>
            <FaTasks />
            <Typography variant="body1">
              Tasks Completed on {selectedDate.format('MMMM D, YYYY')}: {performanceData.length}
            </Typography>
          </div>
          <div>
            <FaClock />
            <Typography variant="body1">
              Total Time Spent on Tasks: {Math.floor(totalTimeSpent / 60)} hours {totalTimeSpent % 60} minutes
            </Typography>
          </div>
        </Paper>

        {/* Wellness Data Section */}
        <Paper className="dashboard-card" elevation={3}>
          <Typography variant="h5">Wellness Check-in</Typography>

          <div>
            <MdMood />
            <Typography variant="body1">
              Mood Rating: {wellnessData.mood} / 5
            </Typography>
          </div>
          <div>
            <MdOutlineEnergySavingsLeaf />
            <Typography variant="body1">
              Energy Rating: {wellnessData.energy} / 5
            </Typography>
          </div>
          <div>
            <MdAdjust />
            <Typography variant="body1">
              Ambition Rating: {wellnessData.ambition} / 5
            </Typography>
          </div>
          <div>
            <MdOutlineThumbUp />
            <Typography variant="body1">
              Well-being Rating: {wellnessData.wellbeing} / 5
            </Typography>
          </div>

          {/* Line Chart for Wellness Data */}
          <div className="line-chart-container">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </Paper>

        {/* Feedback button component */}
        <Feedback />
      </Box>
    </div>
  );
};

export default DashboardPage;
