import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import { FaTasks, FaClock } from 'react-icons/fa';
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
  //const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [wellnessData, setWellnessData] = useState([]);
  const user = useSelector(getUser);
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs());
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs());

  // Fetch data based on the selected date
  useEffect(() => {
    const fetchCheckinData = async () => {
      const formattedStartDate = selectedStartDate.format('YYYY-MM-DD');
      const formattedEndDate = selectedEndDate.format('YYYY-MM-DD');

      const response = await api.get(`checkins/${user.id}/start/${formattedStartDate}/end/${formattedEndDate}`);
      const res = await api.get(`/task/user/${user.id}/start/${formattedStartDate}/end/${formattedEndDate}`);

      if (response.data.data !== null) {
        setWellnessData(response.data.data);
      } else {
        showToast('No data for this day', 'error');
        setWellnessData([]);
      }

      if (res.data.data !== null) {
        setPerformanceData(res.data.data);
        //calculateTotalTimeSpent(res.data.data);
      }
    };

    fetchCheckinData();
  }, [selectedStartDate, selectedEndDate, user.id]);

  // const calculateTotalTimeSpent = (data) => {
  //   const totalTimeInSeconds = data.reduce((acc, task) => acc + task.timespent, 0);
  //   const totalTimeInMinutes = Math.floor(totalTimeInSeconds / 60);
  //   setTotalTimeSpent(totalTimeInMinutes);
  // };

  // Extract labels (dates) and data for each wellness attribute
  const getChartDataForAttribute = (attribute) => {
    const labels = wellnessData.map((entry) => dayjs(entry.timestamp).format('MMM D'));
    const data = wellnessData.map((entry) => entry[attribute]);
    return {
      labels,
      datasets: [
        {
          label: `${attribute.charAt(0).toUpperCase() + attribute.slice(1)} Rating`,
          data,
          borderColor: 'rgba(0, 128, 0, 1)',
          backgroundColor: 'rgba(0, 128, 0, 0.2)',
          fill: true,
        },
      ],
    };
  };

  const getTimeSpentData = () => {
    const labels = performanceData.map((entry) => dayjs(entry.date).format('MMM D'));
    const data = performanceData.map((entry) => entry.totalTimeSpent);
    return { labels, data };
  };

  const getTasksData = () => {
    const labels = performanceData.map((entry) => dayjs(entry.date).format('MMM D'));
    const data = performanceData.map((entry) => entry.totalTasks);
    return { labels, data };
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels:{
          font: {
            size: 16, 
          },
        }
      },
      title: {
        display: true,
        colors:"green"
      },
      
    },
  };

  const timeSpentChartData = getTimeSpentData();
  const tasksChartData = getTasksData();

  return (
    <div className="dashboard-container">
      <Toast />
      <Typography variant="h3" className="dashboard-title">
        Performance and Rating
      </Typography>
      <div className="date-picker-section">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box className="date-picker-container" sx={{ mb: 4, marginTop: 2 }}>
            <DatePicker
              label="Start Date"
              value={selectedStartDate}
              onChange={(newDate) => setSelectedStartDate(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
        <Typography variant="h6" className="date-picker-range" sx={{ marginLeft: 3, marginRight: 3 }}>
          to
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box className="date-picker-container" sx={{ mb: 4, marginTop: 2 }}>
            <DatePicker
              label="End Date"
              value={selectedEndDate}
              onChange={(newDate) => setSelectedEndDate(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
      </div>

      <Box className="dashboard-section">
        <Paper className="dashboard-card" elevation={3}>
          <Typography variant="h5">Work Performance</Typography>
          
          <div className="perfomance-chart-container">
            <div className="line-chart-container">
              <Line
              data={{
                labels: timeSpentChartData.labels,
                datasets: [
                  {
                    label: 'Total Time Spent (minutes)',
                    data: timeSpentChartData.data,
                    borderColor: 'rgba(0, 128, 0, 1)',
                    backgroundColor: 'rgba(0, 128, 0, 0.2)',
                    fill: true,
                  },
                ],
              }}
              options={{
                ...lineChartOptions,
                title: { text: 'Total Time Spent Overview' },
              }}
            />
            </div>
            
          <div className="line-chart-container">
            <Line
              data={{
                labels: tasksChartData.labels,
                datasets: [
                  {
                    label: 'Total Tasks Completed',
                    data: tasksChartData.data,
                    borderColor: 'rgba(0, 128, 0, 1)',
                    backgroundColor: 'rgba(0, 128, 0, 0.2)',
                    fill: true,
                  },
                ],
              }}
              options={{
                ...lineChartOptions,
                title: { text: 'Total Tasks Overview' },
              }}
            />
          </div>
          </div>
          
        </Paper>


        {/* Wellness Data Section with Separate Line Charts for each attribute */}
        <Paper className="dashboard-card-chart" elevation={3}>

          <div className="line-chart-container">

            <Line  data={getChartDataForAttribute('mood')} options={{ ...lineChartOptions, title: { text: 'Mood Rating Overview' } }} />
          </div>
          <div className="line-chart-container">

            <Line data={getChartDataForAttribute('energy')} options={{ ...lineChartOptions, title: { text: 'Energy Rating Overview' } }} />
          </div>
         
        </Paper>
        <Paper className="dashboard-card-chart">

        <div className="line-chart-container">
            <Line data={getChartDataForAttribute('ambition')} options={{ ...lineChartOptions, title: { text: 'Ambition Rating Overview' } }} />
          </div>
          <div className="line-chart-container">
            <Line data={getChartDataForAttribute('wellbeing')} options={{ ...lineChartOptions, title: { text: 'Well-being Rating Overview' } }} />
          </div>
        </Paper>

        {/* Feedback button component */}
        <Feedback />
      </Box>
    </div>
  );
};

export default DashboardPage;
