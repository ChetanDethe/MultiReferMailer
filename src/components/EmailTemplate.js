// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/EmailTemplate.css';

// const EmailTemplate = ({ email }) => {
//   const [subject, setSubject] = useState('');
//   const [body, setBody] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/auth/update-template', {
//         email,
//         subject,
//         body,
//       });
//       alert('Template saved');
//     } catch (err) {
//       console.error(err);
//       alert('Error saving template');
//     }
//   };

//   const handleCancel = () => {
//     setSubject('');
//     setBody('');
//   };

//   return (
//     <div className="email-template-container">
//       <h2>Email Template</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Email Subject"
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//           required
//         />
//         <textarea
//           placeholder="Email Body"
//           value={body}
//           onChange={(e) => setBody(e.target.value)}
//           required
//         />
//         <div className="buttons">
//           <button type="submit">Submit</button>
//           <button type="button" onClick={handleCancel}>Cancel</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EmailTemplate;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EmailTemplate.css';

const EmailTemplate = ({ email }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [previousTemplate, setPreviousTemplate] = useState(null);
  const [showPreviousTemplate, setShowPreviousTemplate] = useState(false);

  // Fetch previous email template when component mounts
  useEffect(() => {
    const fetchPreviousTemplate = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/user/${email}`);
        if (res.data.emailTemplate && (res.data.emailTemplate.subject || res.data.emailTemplate.body)) {
          setPreviousTemplate(res.data.emailTemplate);
        }
      } catch (err) {
        console.error('Error fetching previous email template:', err);
      }
    };
    fetchPreviousTemplate();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/update-template', {
        email,
        subject,
        body,
      });
      setPreviousTemplate({ subject, body }); // Update previous template after saving
      alert('Template saved');
    } catch (err) {
      console.error('Error saving template:', err);
      alert('Error saving template');
    }
  };

  const handleCancel = () => {
    setSubject('');
    setBody('');
  };

  const handleShowPreviousTemplate = () => {
    if (previousTemplate) {
      setShowPreviousTemplate(true);
    } else {
      alert('No previous email template found');
    }
  };

  const handleClosePreviousTemplate = () => {
    setShowPreviousTemplate(false);
  };

  return (
    <div className="email-template-container">
      <h2>Email Template</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          placeholder="Email Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <div className="buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="button" onClick={handleShowPreviousTemplate}>
            Show Previous Email Template
          </button>
        </div>
      </form>

      {/* Previous Email Template Modal */}
      {showPreviousTemplate && previousTemplate && (
        <div className="template-preview-overlay">
          <div className="template-preview-modal">
            <h3>Previous Email Template</h3>
            <div className="template-preview-content">
              <h4>Subject:</h4>
              <p>{previousTemplate.subject}</p>
              <h4>Body:</h4>
              <pre>{previousTemplate.body}</pre>
            </div>
            <button className="close-template-preview" onClick={handleClosePreviousTemplate}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplate;