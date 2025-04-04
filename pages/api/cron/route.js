import { NextResponse } from 'next/server';

export async function GET() {

    // URL of the sitemap.xml file
  const sitemapUrl = 'https://ziploc.com/sitemap.xml'; // Replace with your actual URL

  // SFTP configuration
  const sftpConfig = {
    host: process.env.SFTP_HOST,
    port: process.env.SFTP_PORT || 22,  // Default SFTP port is 22
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
    // Optional: use privateKey and passphrase for authentication if needed
    // privateKey: require('fs').readFileSync('/path/to/private/key'),
    // passphrase: process.env.SFTP_PASSPHRASE,
  };

  try {
    // Step 1: Fetch the sitemap.xml file from the URL
    const response = await axios.get(sitemapUrl);
    const sitemapXml = response.data;

    // Step 2: Connect to the SFTP server
    const sftp = new SFTPClient();
    await sftp.connect(sftpConfig);

    // Step 3: Upload the sitemap.xml to the SFTP server
    const remotePath = '/xml/sitemap1.xml'; // Specify the remote path on the SFTP server
    await sftp.put(Buffer.from(sitemapXml), remotePath);

    // Close the SFTP connection
    await sftp.end();

    // Return a success response
    res.status(200).json({ message: 'Sitemap uploaded successfully' });
  } catch (error) {
    console.error('Error uploading sitemap:', error);
    res.status(500).json({ message: 'Failed to upload sitemap', error: error.message });
  }
  return NextResponse.json({ ok: true });
}