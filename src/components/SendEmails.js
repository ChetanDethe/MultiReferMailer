// import React, { useState } from 'react';
// import Papa from 'papaparse';
// import axios from 'axios';
// import '../styles/SendEmails.css';

// const SendEmails = ({ email }) => {
//   const [csvData, setCsvData] = useState(null);
//   const [isSendingEnabled, setIsSendingEnabled] = useState(false);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     Papa.parse(file, {
//       header: true,
//       complete: (result) => {
//         setCsvData(result.data);
//         setIsSendingEnabled(true);
//       },
//     });
//   };

// //   const handleSendEmails = async () => {
// //     if (!csvData) return alert('Please upload a CSV file');
// //     try {
// //       await axios.post('http://localhost:5000/api/email/send-emails', {
// //         email,
// //         recipients: csvData,
// //       });
// //       alert('Emails sent successfully');
// //     } catch (err) {
// //       console.error(err);
// //       alert('Error sending emails');
// //     }
// //   };

// const handleSendEmails = async () => {
//     if (!csvData) return alert('Please upload a CSV file');
  
//     // Validate CSV data before sending
//     const validRecipients = csvData.filter(
//       (recipient) => recipient.Email && typeof recipient.Email === 'string'
//     );
  
//     if (validRecipients.length === 0) {
//       return alert('No valid recipients found in the CSV file');
//     }
  
//     try {
//       const response = await axios.post('http://localhost:5000/api/email/send-emails', {
//         email,
//         recipients: validRecipients,
//       });
//       alert('Emails sent successfully');
//       console.log('Send emails response:', response.data);
//     } catch (err) {
//       console.error('Error sending emails:', err.response?.data || err.message);
//       alert(`Error sending emails: ${err.response?.data?.error || err.message}`);
//     }
//   };

  
//   return (
//     <div className="send-emails-container">
//       <h2>Send Emails</h2>
//       <input type="file" accept=".csv" onChange={handleFileChange} />
//       <div className="buttons">
//         <button disabled={!isSendingEnabled} onClick={handleSendEmails}>
//           Send Email to HR
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SendEmails;

import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import '../styles/SendEmails.css';

const SendEmails = ({ email }) => {
  const [csvData, setCsvData] = useState(null);
  const [isSendingEnabled, setIsSendingEnabled] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailStatuses, setEmailStatuses] = useState([]); // Track status of each email

  // Helper function to add a delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        setCsvData(result.data);
        setIsSendingEnabled(true);
      },
    });
  };

  const handleSendEmails = async () => {
    if (!csvData) return alert('Please upload a CSV file');

    // Validate CSV data before sending
    const validRecipients = csvData.filter(
      (recipient) => recipient.Email && typeof recipient.Email === 'string'
    );

    if (validRecipients.length === 0) {
      return alert('No valid recipients found in the CSV file');
    }

    // Initialize email statuses
    const initialStatuses = validRecipients.map((recipient) => ({
      email: recipient.Email,
      status: 'Pending', // Initial status
    }));
    setEmailStatuses(initialStatuses);
    setIsSending(true);

    try {
      // Send emails one by one with status updates
      for (let i = 0; i < validRecipients.length; i++) {
        const recipient = validRecipients[i];

        // Update status to "Sending"
        setEmailStatuses((prev) =>
          prev.map((status, index) =>
            index === i ? { ...status, status: 'Sending' } : status
          )
        );

        try {
          await axios.post('http://localhost:5000/api/email/send-emails', {
            email,
            recipients: [recipient], // Send one email at a time
          });

          // Update status to "Sent"
          setEmailStatuses((prev) =>
            prev.map((status, index) =>
              index === i ? { ...status, status: 'Sent' } : status
            )
          );
        } catch (err) {
          console.error(`Failed to send email to ${recipient.Email}:`, err);

          // Update status to "Failed"
          setEmailStatuses((prev) =>
            prev.map((status, index) =>
              index === i ? { ...status, status: 'Failed' } : status
            )
          );
        }

        // Add a small delay to simulate and visualize the process
        await delay(500); // 500ms delay between emails for visualization
      }

      alert('Email sending process completed');
    } catch (err) {
      console.error('Error sending emails:', err.response?.data || err.message);
      alert(`Error sending emails: ${err.response?.data?.error || err.message}`);
    } finally {
      // Reset sending state after completion
      setIsSending(false);
    }
  };

  const handleCloseVisualizer = () => {
    setIsSending(false);
    setEmailStatuses([]);
  };

  return (
    <div className="send-emails-container">
      <h2>Send Emails</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <div className="buttons">
        <button disabled={!isSendingEnabled || isSending} onClick={handleSendEmails}>
          Send Email to HR
        </button>
      </div>

      {/* Visualizer Modal */}
      {isSending && (
        <div className="visualizer-overlay">
          <div className="visualizer-modal">
            <h3>Sending Emails...</h3>
            <div className="email-list">
              {emailStatuses.map((status, index) => (
                <div
                  key={index}
                  className={`email-item email-item-${status.status.toLowerCase()}`}
                >
                  <span className="email-address">{status.email}</span>
                  <span className="email-status">{status.status}</span>
                </div>
              ))}
            </div>
            <button className="close-visualizer" onClick={handleCloseVisualizer}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendEmails;