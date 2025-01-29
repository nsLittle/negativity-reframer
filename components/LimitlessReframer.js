'use client';
import { useState } from "react";

export default function LimitlessReframer() {
  const [ramble, setRamble] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');

  const fetchResponse = async () => {
    try {
      const API_URL = process.env.NODE_ENV === 'production'
      ? 'https://limitless-reframer-7e82e380af02.herokuapp.com/'.replace(/\/$/, '')
      : 'https://limitless-reframer-7e82e380af02.herokuapp.com/'.replace(/\/$/, '');

      const res = await fetch(`${API_URL}/auntiemindset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json();
         setResponse(data.completion);
      } else {
        console.log('Error', res.status)
      }

    } catch (error) {
      console.log('Error fetching response :',error);
    }
  };

  const handleThoughts = (e) => {
    const thought = e.target.value;
    setPrompt(thought);
  }

  const handleClick = async (e) => {
    e.preventDefault();

    if (prompt.trim()!== '') {
      await fetchResponse();
    }
  };

  const handleEmail = () => {
    if (!response) {
      alert('Please generate a response before sending an email.');
      return;
    }
    setShowPopup(true);
  };

  const sendEmail = () => {
    if (!email.trim()) {
      alert('Please enter a valid email address.');
      return;
    }

    const subject = "Limitless Reframer";
    const body = `Here is your Limitless Guru responding to your limiting beliefs from the Reframer:\n\nPrompt: ${prompt}\n\nResponse: ${response}`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;

    setShowPopup(false);
  };

  return (
    <>
      <div className="reframer-box">
        <p className="intro-text">Turn your limiting believes</p>
        <p className="intro-text">into the limitless you!</p>
        <input className="reframer-input" value={prompt} placeholder="Your thoughts" onChange={handleThoughts}>
        </input>
        
        <br />
        
        <button className="reframer-submit" type="button" onClick={handleClick}>Limiteless!</button>

        <button className="reframer-email" type="button" onClick={handleEmail}>
          Email My Results
        </button>

         <div className="reframer-output">
            {response && <h3>{response}</h3>}
          </div>
      </div>

       {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Enter your email address</h3>
            <input
              type="email"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />
            <div className="popup-buttons">
              <button onClick={sendEmail}>Send Email</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
        )}
    </>
  );
}