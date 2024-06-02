import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { promises } from "dns";

const storage = new Storage();

const RES360P = "scale=-1:360";

const rawVideoBucketName = "lguedes-yt-raw-videos";
const processedVideoBucketName = "lguedes-yt-proc-videos";

const localRawVideoPath = "./RawVideos";
const localProcessedVideoPath = "./ProcessedVideos";

export function setupDirectories() {
  ensureDirectoryExistence(localRawVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", RES360P)
      .on("end", function () {
        console.log("Processing finished successfully");
        resolve(true);
      })
      .on("error", function (err: any) {
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param fileName - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(filename: string) {
  const fileDestination = `${localRawVideoPath}/${filename}`;
  try {
    await storage
      .bucket(rawVideoBucketName)
      .file(filename)
      .download({ destination: fileDestination });
  } catch (err) {
    console.log(err);
    return err;
  }
  console.log(
    `Download Succeded: gs://${rawVideoBucketName}/${filename}. Stored into: ${fileDestination}`,
  );
}

/**
 * @param fileName - The name of the file to upload from the
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(filename: string) {
  const fileDestination = `${localProcessedVideoPath}/${filename}`;
  const bucket = storage.bucket(processedVideoBucketName);

  try {
    console.log(
      `Uploading Processed video ${filename} into: ${fileDestination}`,
    );
    await bucket.upload(fileDestination, {
      destination: filename,
    });
    await bucket.file(filename).makePublic();
  } catch (err) {
    console.log(
      `Fail Uploading Processed video ${filename} into: ${fileDestination} Error:`,
      err,
    );
    return err;
  }
  console.log(
    `Uploading finished successfully to the destination: ${fileDestination}`,
  );
  return fileDestination;
}

export async function deleteRawVideo(fileName: string) {
  return await deleteFile(`${localRawVideoPath}/${fileName}`);
}

export async function deleteProcessedVideo(fileName: string) {
  return await deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

async function deleteFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`File deleted at ${filePath}`);
    } else {
      console.log(`File not found at ${filePath}, skipping delete.`);
    }
  } catch (err) {
    console.error(`Failed to delete file at ${filePath}`, err);
    throw err;
  }
}

function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
    console.log(`Directory created at ${dirPath}`);
  }
}