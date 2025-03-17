import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailTemplate from './EmailTemplate';
import CVUpload from './CVUpload';
import SendEmails from './SendEmails';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('send-emails');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/user/${email}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [email]);

  const handleLogout = () => {
    navigate('/');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <div className="user-name">
          Welcome, {user.firstName} {user.lastName}
        </div>
        <div className="nav-links">
          <button onClick={() => setActiveTab('send-emails')}>SEND EMAILS</button>
          <button onClick={() => setActiveTab('email-template')}>EMAIL TEMPLATE</button>
          <button onClick={() => setActiveTab('cv')}>CV</button>
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>
      <div className="content">
        {activeTab === 'send-emails' && <SendEmails email={email} />}
        {activeTab === 'email-template' && <EmailTemplate email={email} />}
        {activeTab === 'cv' && <CVUpload email={email} />}
      </div>
    </div>
  );
};

export default Dashboard;