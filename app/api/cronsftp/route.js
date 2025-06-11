import axios from "axios";
import { Client } from "ssh2";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  console.log("Cron job triggered at:", new Date().toISOString());

  const sitemapUrl = "https://ziploc.com/sitemap.xml";

  const sftpConfig = {
    host: process.env.SFTP_HOST,
    port: 22,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
  };

  try {
    // Step 1: Download sitemap
    console.log("Fetching sitemap...");
    const response = await axios.get(sitemapUrl);
    const sitemapXml = response.data;

    // Step 2: Connect and upload
    console.log("Connecting to SFTP server...");
    await new Promise((resolve, reject) => {
      const conn = new Client();
      conn
        .on("ready", () => {
          console.log("SFTP connection ready");
          conn.sftp((err, sftp) => {
            if (err) {
              conn.end();
              return reject(err);
            }

            const remotePath = "/xml/sitemap1.xml";
            const writeStream = sftp.createWriteStream(remotePath);

            writeStream.on("close", () => {
              console.log("Sitemap uploaded successfully");
              conn.end();
              resolve();
            });

            writeStream.on("error", (streamErr) => {
              conn.end();
              reject(streamErr);
            });

            writeStream.end(Buffer.from(sitemapXml));
          });
        })
        .on("error", reject)
        .connect(sftpConfig);
    });

    return NextResponse.json({ message: "Sitemap uploaded successfully" });
  } catch (error) {
    console.error("Error uploading sitemap:", error);
    return NextResponse.json(
      { message: "Failed to upload sitemap", error: error.message },
      { status: 500 }
    );
  }
}
