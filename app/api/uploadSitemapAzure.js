import axios from 'axios';
import { BlobServiceClient } from '@azure/storage-blob';

export default async function handler(req, res) {
  console.info('sitemap to Azure:');
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method allowed' });
  }

  // URL of the sitemap.xml file
  const sitemapUrl = 'https://ziploc.com/sitemap.xml'; // Replace with your actual URL

  try {
    // Step 1: Fetch the sitemap.xml file from the URL
    const response = await axios.get(sitemapUrl);
    const sitemapXml = response.data;

    // Step 2: Connect to Azure Blob Storage
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_CONTAINER_NAME // Default container
    const blobPath = 'xml/sitemap.xml'; // path inside the container

    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not defined in environment');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    // Step 3: Upload the sitemap content
    await blockBlobClient.upload(sitemapXml, Buffer.byteLength(sitemapXml), {
      blobHTTPHeaders: { blobContentType: 'application/xml' }
    });

    // Return a success response
    res.status(200).json({ message: 'Sitemap uploaded to Azure successfully' });

  } catch (error) {
    console.error('Error uploading sitemap to Azure:', error);
    res.status(500).json({ message: 'Failed to upload sitemap', error: error.message });
  }
}
