import express from "express";
import ffmpeg from "fluent-ffmpeg";
import "./storage";
import {
  convertVideo,
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  setupDirectories,
  uploadProcessedVideo,
} from "./storage";

const app = express();
app.use(express.json());

setupDirectories();

app.post("/process-video", async (req, res) => {
  // Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, "base64").toString(
      "utf8",
    );
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error("Invalid message payload received.");
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Bad Request: missing filename." });
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  await downloadRawVideo(inputFileName);

  try {
    await convertVideo(inputFileName, outputFileName);
  } catch (err) {
    await Promise.all([
      // Slight better performance
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName),
    ]);
    return res
      .status(500)
      .json({ message: "Internal Server Error: Processing failed" });
  }

  await uploadProcessedVideo(outputFileName);

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName),
  ]);

  return res.status(200).json({ message: "Processing resolved successfully" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});