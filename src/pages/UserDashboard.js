import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserDashboard.css';
import logo from '../assests/Frame.png';
import userIcon from '../assests/icon.png';

const UserDashboard = () => {
  const { userToken, logoutUser } = useAuth();
  const navigate = useNavigate();
  let timerInterval = null;
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null); // keep null initially
  const [error, setError] = useState('');
  const [duration, setDuration] = useState(20); // default 20 mins
  const [timeLeft, setTimeLeft] = useState(null); // stores deadline time

  // Fetch duration from backend
  useEffect(() => {
    const fetchTimerSetting = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/test-settings');
        const data = await res.json();
        if (res.ok) {
          setDuration(data.durationInMinutes);
        }
      } catch (err) {
        console.error('Failed to load timer setting');
      }
    };

    fetchTimerSetting();
  }, []);

  // Countdown effect
  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = timeLeft - now;

      if (diff <= 0) {
        clearInterval(interval);
        alert("Time's up!");
        fetchResult();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimeLeft = () => {
    const diff = timeLeft - new Date();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const startTest = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/test/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        // console.log("Received Question:", data.question);
        setQuestion(data.question);
        setIsTestStarted(true);
        const deadline = new Date(Date.now() + duration * 60000);
        setTimeLeft(deadline);
      } else {
        setError(data.error || 'Could not start test');
      }
    } catch (err) {
      setError('Failed to start test.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedOption) {
      alert('Please select an option.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/test/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          questionId: question._id,
          selectedOption
        })
      });
      const data = await res.json();

      if (res.ok) {
        if (data.nextQuestion) {
          setQuestion(data.nextQuestion);
          setSelectedOption('');
        } else {
          fetchResult();
        }
      } else {
        setError(data.error || 'Answer submission failed');
        if (data.error?.includes('Time is up') || data.message === 'Test completed') {
          fetchResult();
        }
      }
    } catch (err) {
      setError('Error submitting answer');
    }
  };

  const fetchResult = async () => {
    try {
      if (timerInterval) clearInterval(timerInterval); // Stop timer
      const res = await fetch('http://localhost:5000/api/test/result', {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        // fallback if API didn't send `careerSuggestions`
        setResult({
          score: data.score || 0,
          outOf: data.outOf || 0,
          careerSuggestions: data.careerSuggestions || []
        });
        setIsTestStarted(false);
        setTimeLeft(null); // stop timer
      } else {
        setError(data.error || 'Could not fetch result');
      }
    } catch (err) {
      setError('Error getting result');
    }
  };

  const handleLogout = () => {
    logoutUser();  // Log out the user and clear token
    navigate('/user-login'); // Redirect to login page
  };

  if (result) {
    return (
      <div className="dashboard">
        <h2>Your Test Result</h2>
        <p>Score: {result.score} / {result.outOf}</p>
        {result.careerSuggestions?.length > 0 ? (
          <>
            <h4>Top Career Suggestions:</h4>
            <ul>
              {result.careerSuggestions.map((c, index) => (
                <li key={index}>{c}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>No career suggestions available.</p>
        )}
        <button className='logout-btn' onClick={handleLogout}>Log Out</button> {/* Logout Button */}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />

        <img
          src={userIcon}
          alt="Profile"
          className="profile-icon"
          onClick={handleLogout}
          title="Log Out"
        />
      </div>

      {error && <p className="error">{error}</p>}

      {isTestStarted && timeLeft && (
        <div className="timer">
          Time Left: <strong>{formatTimeLeft()}</strong>
        </div>
      )}

      {!isTestStarted ? (
        <button onClick={startTest} disabled={isLoading} className="start-btn">
          {isLoading ? 'Starting...' : 'Start Test'}
        </button>
      ) : (
        question && (
          <div className="question-box">
            <h3>{question.questionText}</h3>
            {question.options ? (
              Object.entries(question.options).map(([key, value]) => (
                <div key={key}>
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value={key}
                      checked={selectedOption === key}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    {key}. {value}
                  </label>
                </div>
              ))
            ) : (
              <p>No options available.</p>
            )}
            <button onClick={submitAnswer}>Submit Answer</button>
          </div>
        )
      )}
    </div>
  );
};

export default UserDashboard;
