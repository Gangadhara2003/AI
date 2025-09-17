import React from 'react';
import './LandingPage.css'; // Importing its own CSS
import { assets } from '../../assets/assets'; // Assuming assets are available
import { useAuth } from '../../context/AuthContext';

const LandingPage = ({ onStartChat, onLogin }) => {
  const { userInfo } = useAuth();

  const handleStartClick = () => {
    if (userInfo) {
      onStartChat(); // This will navigate to /home
    } else {
      // Optionally, you can navigate to login here if you want to force login
      // onLogin();
      alert('Please login to start chat.');
    }
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Gemini Clone</h1>
        {userInfo ? (
          <button onClick={onLogin} className="login-button">Login</button>
        ) : (
          <button onClick={onLogin} className="login-button">Login</button>
        )}
      </header>

      <main className="landing-main">
        <div className="landing-content">
          <h2>Welcome to the Gemini Clone!</h2>
          <p>This project is a functional clone of the Gemini AI chat interface, built with React.js. It leverages the power of Google's Gemini API to provide an interactive and responsive conversational AI experience.</p>
          <p>Explore the capabilities of AI, ask questions, generate ideas, and engage in dynamic conversations. Our goal is to provide a seamless and intuitive user experience, mirroring the original Gemini application.</p>
          <button onClick={handleStartClick} className="start-button">Let's Start</button>
        </div>
      </main>

      <footer className="landing-footer">
        <p>Contact Information:</p>
        <div className="contact-links">
          <a href="mailto:your.email@example.com" target="_blank" rel="noopener noreferrer">
            <img src={assets.mail_icon || 'placeholder_mail.png'} alt="Mail" />
          </a>
          <a href="https://www.linkedin.com/in/gangadhara-k-s-563142286?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
            <img src={assets.linkedin_icon || 'placeholder_linkedin.png'} alt="LinkedIn" />
          </a>
          <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer">
            <img src={assets.github_icon || 'placeholder_github.png'} alt="GitHub" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
