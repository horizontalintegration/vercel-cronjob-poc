// /pages/upload.js

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/send-to-sftp', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setStatus(data.message || 'File uploaded successfully');
    } catch (error) {
      setStatus('Upload failed');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to SFTP</button>
      {status && <p>{status}</p>}
    </div>
  );
}
