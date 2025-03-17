// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/CVUpload.css';

// const CVUpload = ({ email }) => {
//   const [cv, setCv] = useState(null);

//   const handleFileChange = (e) => {
//     setCv(e.target.files[0]);
//   };

// const handleUpload = async () => {
//     if (!cv) return alert('Please select a CV');
//     const formData = new FormData();
//     formData.append('cv', cv);
//     formData.append('email', email);
  
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/upload-cv', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Optional, axios sets this automatically
//         },
//       });
//       alert('CV uploaded successfully');
//       console.log('Upload response:', response.data);
//     } catch (err) {
//       console.error('Error uploading CV:', err.response?.data || err.message);
//       alert(`Error uploading CV: ${err.response?.data?.error || err.message}`);
//     }
//   };

  
//   const handleRemove = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/auth/remove-cv', { email });
//       alert('CV removed');
//     } catch (err) {
//       console.error(err);
//       alert('Error removing CV');
//     }
//   };

//   return (
//     <div className="cv-upload-container">
//       <h2>Upload CV</h2>
//       <input type="file" accept="application/pdf" onChange={handleFileChange} />
//       <div className="buttons">
//         <button onClick={handleUpload}>Upload CV</button>
//         <button onClick={handleRemove}>Remove CV</button>
//       </div>
//     </div>
//   );
// };

// export default CVUpload;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CVUpload.css';

const CVUpload = ({ email }) => {
  const [cv, setCv] = useState(null);
  const [previousCvPath, setPreviousCvPath] = useState(null);
  const [showPreviousCv, setShowPreviousCv] = useState(false);

  // Fetch previous CV path when component mounts
  useEffect(() => {
    const fetchPreviousCv = async () => {
      try {
        const res = await axios.get(`https://multi-refer-mailer.vercel.app/api/auth/user/${email}`);
        if (res.data.cv) {
          setPreviousCvPath(res.data.cv);
        }
      } catch (err) {
        console.error('Error fetching previous CV:', err);
      }
    };
    fetchPreviousCv();
  }, [email]);

  const handleFileChange = (e) => {
    setCv(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!cv) return alert('Please select a CV');
    const formData = new FormData();
    formData.append('cv', cv);
    formData.append('email', email);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/upload-cv', formData);
      setPreviousCvPath(response.data.path); // Update previous CV path after upload
      alert('CV uploaded successfully');
    } catch (err) {
      console.error('Error uploading CV:', err.response?.data || err.message);
      alert(`Error uploading CV: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleRemove = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/remove-cv', { email });
      setPreviousCvPath(null); // Clear previous CV path after removal
      alert('CV removed');
    } catch (err) {
      console.error('Error removing CV:', err);
      alert('Error removing CV');
    }
  };

  const handleShowPreviousCv = () => {
    if (previousCvPath) {
      setShowPreviousCv(true);
    } else {
      alert('No previous CV found');
    }
  };

  const handleClosePreviousCv = () => {
    setShowPreviousCv(false);
  };

  return (
    <div className="cv-upload-container">
      <h2>Upload CV</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <div className="buttons">
        <button onClick={handleUpload}>Upload CV</button>
        <button onClick={handleRemove}>Remove CV</button>
        <button onClick={handleShowPreviousCv}>Show Previous CV</button>
      </div>

      {/* Previous CV Modal */}
      {showPreviousCv && previousCvPath && (
        <div className="cv-preview-overlay">
          <div className="cv-preview-modal">
            <h3>Previous CV</h3>
            <div className="cv-preview-content">
              <embed
                src={`http://localhost:5000/${previousCvPath}`}
                type="application/pdf"
                width="100%"
                height="500px"
              />
            </div>
            <button className="close-cv-preview" onClick={handleClosePreviousCv}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVUpload;