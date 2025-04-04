import { useState } from 'react';

export default function UploadSitemapButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/uploadSitemap', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Success message
      } else {
        setMessage(`Error: ${data.message}`); // Error message
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload Sitemap to SFTP'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
