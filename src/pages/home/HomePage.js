import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizPopUp from '../../components/quiz/QuizPopUp';
import { MdBrightness5, MdOutlinePunchClock, MdBarChart,MdHeadphones,MdFeedback } from "react-icons/md";
import './home.css';  
import Feedback from '../../components/feeback/Feedback';
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/userSlice';
import Toast from '../../components/toast/Toast';
import api from '../../api/api';

const motivationalQuotes = [
  "Stay focused and never give up!",
  "Every step brings you closer to your goals.",
  "Small efforts can lead to big success.",
  "You're stronger than you think!",
  "Stay positive, stay productive."
];

const HomePage = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quote, setQuote] = useState('');
  const navigate = useNavigate();
  const user = useSelector(getUser)
  console.log("LogedUser",user)

  const dateToFetch = new Date().toISOString().split('T')[0];


  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, [navigate]);

  useEffect(() => {
    const fetchCheckinData = async () => {
  
      try {
        const response = await api.get(`checkins/${user.id}/date/${dateToFetch}`);
  
        if (response.data.message === "not found") {
          setShowQuiz(true);
        } 
        
      } catch (error) {
        console.error('Error fetching check-in data:', error);
      }
    };
  
    fetchCheckinData();
  }, [dateToFetch, user.id]);
  

  return (
    <div className="homepage-container">
      <Toast/>
      <h3>Hi {user.username}</h3>
      <h1>Welcome to FocusFlow!</h1>

      {/* App Explanation */}
      <div className="app-description">
        <p>FocusFlow is designed to help you maintain productivity through focus sessions and well-timed breaks. Track your work habits, improve well-being, and stay motivated with insightful feedback and personalized tools.</p>
      </div>

      {/* Feature Highlights */}
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="feature">
          <MdBrightness5 className="feature-icon"/>
          Daily Focus Quiz to track your mindset
        </div>
        <div className="feature">
          <MdOutlinePunchClock className="feature-icon"/>
          Work-Break Timer to enhance productivity
        </div>
        <div className="feature">
          <MdBarChart className="feature-icon"/>
          Dashboard for analyzing work patterns
        </div>
        <div className="feature">
          <MdHeadphones className="feature-icon"/>
          Meditate with calming music
        </div>
        <div className="feature">
          <MdFeedback className="feature-icon"/>
          Instant feedback to improve your focus
        </div>
      </div>

      {/* Motivational Quote Section */}
      <div className="motivational-section">
        <h3>Motivational Quote of the Day</h3>
        <p>{quote}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-section">
        <button className="primary-btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        <button className="primary-btn" onClick={() => navigate('/timer')}>Start Work-Break Timer</button>
      </div>

      {/* Feedback button component */}
      <Feedback/>

      {/* Quiz Popup */}
      <QuizPopUp open={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
};

export default HomePage;
