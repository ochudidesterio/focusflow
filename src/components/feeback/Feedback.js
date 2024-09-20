import React, { useState } from 'react';
import Modal from 'react-modal';
import './feedback.css'; 

const Feedback = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //mailto link
    const mailtoLink = `mailto:p2772570@my365.dmu.ac.uk?subject=Feedback%20from%20${encodeURIComponent(feedback.name)}&body=Name:%20${encodeURIComponent(feedback.name)}%0D%0AEmail:%20${encodeURIComponent(feedback.email)}%0D%0AMessage:%20${encodeURIComponent(feedback.message)}`;

    //Open the mailto link
    window.location.href = mailtoLink;

    // Close the modal
    setModalIsOpen(false);
  };

  return (
    <div className="feedback-button-container">
      <button className="feedback-button" onClick={() => setModalIsOpen(true)}>Feedback</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="feedback-modal"
        overlayClassName="feedback-overlay"
        ariaHideApp={false}
      >
        <h2>Submit Feedback</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <label htmlFor="name">Enter your name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={feedback.name}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="email">Enter your email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={feedback.email}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={feedback.message}
            onChange={handleInputChange}
            required
            rows={10}
          ></textarea>
          <div className="modal-actions">
            <button type="submit" className="submit-button">Submit</button>
            <button type="button" className="cancel-button" onClick={() => setModalIsOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Feedback;
