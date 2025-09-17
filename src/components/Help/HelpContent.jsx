import React, { useState } from 'react';
import './Help.css';
import { useAuth } from '../../context/AuthContext';

const HelpContent = ({ onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const { userInfo } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ text: feedback }),
      });

      if (res.ok) {
        setMessage('Feedback submitted successfully!');
        setFeedback('');
      } else {
        setMessage('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="help-overlay">
      <div className="help-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>About This Project</h2>
        <p>
          This is a Gemini clone project, built to demonstrate the capabilities of a large language model in a conversational interface.
          It aims to provide a similar user experience to Google's Gemini, allowing users to interact with an AI assistant for various tasks.
        </p>

        <h3>Contact Information</h3>
        <p>
          If you have any questions or need further assistance, feel free to reach out:
        </p>
        <ul>
          <li>Email: mailto:gangadharaks2003@gmail.com</li>
          <li>LinkedIn: <a href="https://www.linkedin.com/in/gangadhara-k-s-563142286" target="_blank" rel="noopener noreferrer">Gangadhara K S LinkedIn Profile</a></li>
          <li>GitHub: <a href="https://github.com/Gangadhara2003" target="_blank" rel="noopener noreferrer">Gangadhara K S GitHub Profile</a></li>
        </ul>

        <h3>Feedback</h3>
        <p>
          We appreciate your feedback! Please use the form below to share your thoughts, suggestions, or report any issues.
        </p>
        <form className="feedback-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Your feedback..."
            rows="5"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button className='feedback-button' type="submit">Submit Feedback</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default HelpContent;
