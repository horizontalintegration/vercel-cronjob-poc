export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  console.log('Cron job triggered at:', new Date().toISOString());

  const sitemapUrl = 'https://ziploc.com/sitemap.xml';

  const sftpConfig = {
    host: process.env.SFTP_HOST,
    port: 22,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
  };

  try {
    const response = await axios.get(sitemapUrl);
    const sitemapXml = response.data;

    // Dynamically import SFTP client
    const SFTPClient = (await import('ssh2-sftp-client')).default;
    const sftp = new SFTPClient();

    await sftp.connect(sftpConfig);
    await sftp.put(Buffer.from(sitemapXml), '/xml/sitemap1.xml');
    await sftp.end();

    console.log('Sitemap uploaded successfully');
  } catch (error) {
    console.error('Sitemap upload error:', error);
  }

  return NextResponse.json({ ok: true });
}
