import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slider, Button, Typography, Box } from '@mui/material';
import './quiz.css'; 
import { useSelector } from 'react-redux';
import { getUser } from '../../redux/userSlice';
import api from '../../api/api';
import { showToast } from '../toast/Toast';

const QuizPopUp = ({ open, onClose }) => {
  const [mood, setMood] = useState(1);
  const [energy, setEnergy] = useState(1);
  const [ambition, setAmbition] = useState(1);
  const [wellbeing, setWellBeing] = useState(1);
  const user = useSelector(getUser)

  let checkinObj;

  const handleSubmit = async () => {
    try{
        checkinObj = {
          mood: mood,
          energy: energy,
          ambition: ambition,
          wellbeing: wellbeing,
          userId: user.id
        }
        const response = await api.post("/checkins/create",checkinObj)
        console.log("CheckinRes",response.data)
        if(response.data.message === "created"){
          showToast("Success","success ")
        }

    }catch(error){
      console.log("Checkin quiz submission failed")
    }
    console.log({ mood, energy, ambition, wellbeing });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        className: 'quiz-dialog',
      }}
    >
      <DialogTitle>
        <Typography variant="h5" className="quiz-title">
          Daily Check-in Quiz
        </Typography>
        <Typography variant="subtitle1" className="quiz-subtitle">
          Rate the following on a scale of 1 to 5
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box className="slider-container">
          <Box className="slider-item">
            <Typography gutterBottom>How would you rate your current mood: {mood}</Typography>
            <Slider
              value={mood}
              onChange={(e, newValue) => setMood(newValue)}
              aria-labelledby="mood-slider"
              min={1}
              max={5}
              step={1}
              valueLabelDisplay="on"
              className="custom-slider"
            />
          </Box>

          <Box className="slider-item">
            <Typography gutterBottom>How would you rate your current energy level: {energy}</Typography>
            <Slider
              value={energy}
              onChange={(e, newValue) => setEnergy(newValue)}
              aria-labelledby="energy-slider"
              min={1}
              max={5}
              step={1}
              valueLabelDisplay="on"
              className="custom-slider"
            />
          </Box>

          <Box className="slider-item">
            <Typography gutterBottom>How ambitious are you today: {ambition}</Typography>
            <Slider
              value={ambition}
              onChange={(e, newValue) => setAmbition(newValue)}
              aria-labelledby="ambition-slider"
              min={1}
              max={5}
              step={1}
              valueLabelDisplay="on"
              className="custom-slider"
            />
          </Box>

          <Box className="slider-item">
            <Typography gutterBottom>How would you rate your overall well-being: {wellbeing}</Typography>
            <Slider
              value={wellbeing}
              onChange={(e, newValue) => setWellBeing(newValue)}
              aria-labelledby="wellbeing-slider"
              min={1}
              max={5}
              step={1}
              valueLabelDisplay="on"
              className="custom-slider"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#4CAF50', color: '#4CAF50' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizPopUp;
