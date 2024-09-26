import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Feedback from '../../components/feeback/Feedback';
import './dashboard.css';
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/userSlice';
import Toast, { showToast } from '../../components/toast/Toast';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import supabase from '../../config/SupabaseClient';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [performanceData, setPerformanceData] = useState([]);
  //const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [wellnessData, setWellnessData] = useState([]);
  const user = useSelector(getUser);
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs());
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs());

  useEffect(() => {
    const fetchCheckinData = async () => {
      const formattedStartDate = selectedStartDate.format('YYYY-MM-DD');
      const formattedEndDate = selectedEndDate.format('YYYY-MM-DD');
  
      try {
        // Fetch check-ins for the given userId within the date range
        const { data: checkinData, error: checkinError } = await supabase
          .from('DailyCheckin')
          .select()
          .eq('user_id', user.id)
          .gte('created', `${formattedStartDate}T00:00:00+00:00`)
          .lte('created', `${formattedEndDate}T23:59:59+00:00`);
  
        if (checkinError) {
          throw checkinError;
        }
  
        // Fetch tasks for the given userId within the date range
        const { data: taskData, error: taskError } = await supabase
          .from('Task')
          .select()
          .eq('user_id', user.id)
          .gte('created', `${formattedStartDate}T00:00:00+00:00`)
          .lte('created', `${formattedEndDate}T23:59:59+00:00`);
  
        if (taskError) {
          throw taskError;
        }
  
        // Set wellness data (DailyCheckin) if data is available
        if (checkinData && checkinData.length > 0) {
          setWellnessData(checkinData);
        } else {
          showToast('No wellness data for this period', 'error');
          setWellnessData([]);
        }
  
        // Set performance data (Task) if data is available
        if (taskData && taskData.length > 0) {
          setPerformanceData(taskData);
          // Optionally calculate total time spent
          // calculateTotalTimeSpent(taskData);
        } else {
          showToast('No performance data for this period', 'error');
          setPerformanceData([]);
        }
  
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  
    fetchCheckinData();
  }, [selectedStartDate, selectedEndDate, user.id]);


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

  

  const processPerformanceData = () => {
    // Group the performanceData by date
    const groupedData = performanceData.reduce((acc, entry) => {
      const date = dayjs(entry.created).format('YYYY-MM-DD'); // Group by the date (ignoring the time part)
  
      if (!acc[date]) {
        acc[date] = {
          totalTimeSpent: 0,
          totalTasks: 0
        };
      }
  
      //Add the time spent and increment the task count
      acc[date].totalTimeSpent += entry.timespent;
      acc[date].totalTasks += 1;
  
      return acc;
    }, {});
  
    //Convert grouped data into arrays suitable for the graph
    const processedData = Object.keys(groupedData).map(date => ({
      date,
      totalTimeSpent: groupedData[date].totalTimeSpent,
      totalTasks: groupedData[date].totalTasks
    }));
  
    return processedData;
  };
  
  // prepare labels and data for the total time spent graph
  const getTimeSpentData = () => {
    const processedData = processPerformanceData();
    const labels = processedData.map((entry) => dayjs(entry.date).format('MMM D'));
    const data = processedData.map((entry) => entry.totalTimeSpent);
  
    return { labels, data };
  };
  
  // prepare labels and data for the total tasks graph
  const getTasksData = () => {
    const processedData = processPerformanceData();
    const labels = processedData.map((entry) => dayjs(entry.date).format('MMM D'));
    const data = processedData.map((entry) => entry.totalTasks);
  
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
