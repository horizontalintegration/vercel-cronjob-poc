import UploadSitemapButton from '../components/UploadSitemapButton';
import UploadSitemapButtonAzure from '../components/UploadSitemapButtonAzure';

export default function Home() {
  return (
    <div>
      <h1>Upload Sitemap to SFTP</h1>
      <UploadSitemapButton />

      <h1>Upload Sitemap to Azure</h1>
      <UploadSitemapButtonAzure />
    </div>
  );
}
