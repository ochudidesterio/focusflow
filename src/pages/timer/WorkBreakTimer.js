import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './timer.css';
import { MdCheckCircle } from "react-icons/md";
import Feedback from '../../components/feeback/Feedback';
import Meditate from '../../components/meditate/Meditate';
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/userSlice';
import supabase from '../../config/SupabaseClient';


// motivational quotes and break suggestions
const motivationalQuotes = [
  "Stay positive, work hard, make it happen!",
  "Success is the sum of small efforts, repeated day in and day out.",
  "You are capable of amazing things.",
  "Believe in yourself and all that you are.",
  "Start where you are. Use what you have. Do what you can.",
  "The only way to achieve the impossible is to believe it is possible.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Success doesn’t come from what you do occasionally, it comes from what you do consistently.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "The future depends on what you do today."
];


const breakSuggestions = [
  "Stretch your legs.",
  "Drink a glass of water.",
  "Take a quick walk outside.",
  "Do a breathing exercise.",
  "Meditate for a few minutes.",
  "Do some light stretching exercises.",
  "Step away from the screen and rest your eyes.",
  "Listen to some calming music.",
  "Grab a healthy snack.",
  "Take a few deep breaths to relax and refocus."
];


const WorkBreakTimer = () => {
  const [workTime, setWorkTime] = useState(25); // Default work time
  const [breakTime, setBreakTime] = useState(5); // Default break time
  const [timeLeft, setTimeLeft] = useState(workTime * 60); // Initialize timer with work time
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTimer, setIsWorkTimer] = useState(true); 
  const [showQuotePopup, setShowQuotePopup] = useState(true);
  const [showBreakPopup, setShowBreakPopup] = useState(false);
  const [showStickyPopUp,setShowStickyPopUp] = useState(false)
  const [completedTasks, setCompletedTasks] = useState(0);
  const [playSound, setPlaySound] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const user = useSelector(getUser)


  // Set a random motivational quote when the component mounts
  useEffect(() => {
    setSelectedQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);


  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setPlaySound(true);
      if (isWorkTimer) {
        setShowBreakPopup(true);
        setSelectedSuggestion(breakSuggestions[Math.floor(Math.random() * breakSuggestions.length)]);
      } else {
        //alert('Break over! Time to get back to work.');
        setShowStickyPopUp(true)
      }
      setIsWorkTimer(!isWorkTimer);
      setTimeLeft(isWorkTimer ? breakTime * 60 : workTime * 60);
    }
  }, [isRunning, timeLeft, isWorkTimer, workTime, breakTime]);

  // Play notification sound when playSound is true
  useEffect(() => {
    if (playSound) {
      const audio = new Audio(require('../../assets/notification.mp3')); 
      audio.play().catch(error => {
        console.error("Error playing sound:", error);
      });
      setPlaySound(false); 
    }
  }, [playSound]);

  // Start the timer
  const startTimer = () => setIsRunning(true);

  // Pause the timer
  const pauseTimer = () => setIsRunning(false);

  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkTimer ? workTime * 60 : breakTime * 60);
  };

  // Increment the completed tasks counter and submit
  const completeTask = async () => {
    const timeSpent = isWorkTimer ? (workTime * 60 - timeLeft) : (breakTime * 60 - timeLeft);
  
    try {
      const taskObj = {
        user_id: user.id,
        timespent: timeSpent,
        created: new Date().toISOString() 
      };
  
      // Insert task into Supabase 'Task' table
      const { data, error } = await supabase
        .from('Task')
        .insert([taskObj]).select();
  
      if (error) {
        throw error;
      }
  
       // Log the response data
       console.log("Task data :", taskObj);
      // Log the response data
      console.log("Task data response:", data);
  
      if (data) {
        // If insertion is successful
        setCompletedTasks(completedTasks + 1);
        // Optionally, reset the timer
        // resetTimer();
      }
  
    } catch (error) {
      console.log("Time spent submission error:", error.message);
    }
  };
  
  

  // End the day and reset the timer and task counter
  const endDay = () => {
    setCompletedTasks(0);
    resetTimer();
  };

  return (
    <div className="timer-container">
      <h1>{isWorkTimer ? 'Work Timer' : 'Break Timer'}</h1>
      <div className='timer-input'>
        <label>Work Time (minutes): </label>
        <input
          type="number"
          value={workTime}
          onChange={(e) => setWorkTime(Number(e.target.value))}
        />
      </div>
      <div className='timer-input'>
        <label>Break Time (minutes): </label>
        <input
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(Number(e.target.value))}
        />
      </div>

      <div className="timer-display">
        {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
      </div>

      <div className="timer-controls">
        <button onClick={startTimer}>Start</button>
        <button onClick={pauseTimer}>Pause</button>
        <button onClick={resetTimer}>Reset</button>
        <button onClick={completeTask}>Task Completed</button>
      </div>

      <div className="task-counter">
        <h3>Tasks Completed Today: {completedTasks}</h3>
      </div>


      <Modal
        isOpen={showQuotePopup}
        onRequestClose={() => setShowQuotePopup(false)}
        className="modal"
      >
        <div className="modal-content">
          <h2>Motivational Quote</h2>
          <p>{selectedQuote}</p>
          <button onClick={() => setShowQuotePopup(false)}><MdCheckCircle size={30}/></button>
        </div>
      </Modal>

      <Modal
        isOpen={showStickyPopUp}
        onRequestClose={() => setShowStickyPopUp(false)}
        className="modal"
      >
        <div className="modal-content">
          <h2>Ready to start working!</h2>
          <p>{selectedQuote}</p>
          <button onClick={() => setShowStickyPopUp(false)}><MdCheckCircle size={30}/></button>
        </div>
      </Modal>

      <Modal
        isOpen={showBreakPopup}
        onRequestClose={() => setShowBreakPopup(false)}
        className='modal'
      >
        <div className="modal-content">
          <h2>Break Time Suggestion</h2>
          <p>{selectedSuggestion}</p>
          <button onClick={() => setShowBreakPopup(false)}><MdCheckCircle size={30}/></button>
        </div>
      </Modal>
      {/* Meditate component */}
      <Meditate/>

      <button className="end-day-button" onClick={endDay}>End Day</button>

      {/* Feedback component */}
      <Feedback />
    </div>
  );
};

export default WorkBreakTimer;
