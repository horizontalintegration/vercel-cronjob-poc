import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs"; // Only needed in app router

export async function GET() {
  console.info("Cron job of Azure Started");
  const sitemapUrl = "https://ziploc.com/sitemap.xml";

  try {
    // Step 1: Download the sitemap XML
    const response = await axios.get(sitemapUrl);
    const sitemapXml = response.data;

    // Step 2: Connect to Azure Blob Storage
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_CONTAINER_NAME;

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    await containerClient.createIfNotExists({ access: "container" });

    // Step 3: Upload the file
    const blobName = `xml/sitemap-${Date.now()}.xml`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(sitemapXml, Buffer.byteLength(sitemapXml), {
      blobHTTPHeaders: { blobContentType: "application/xml" },
    });

    console.log(`Uploaded ${blobName} successfully.`);
    return NextResponse.json({ ok: true, blobName });
  } catch (error) {
    console.error("Upload error:", error.message);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
