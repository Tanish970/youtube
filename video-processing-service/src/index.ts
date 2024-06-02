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
<<<<<<< HEAD
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
=======
const port=process.env.port||3000;


app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Working")
})

app.post('/process-video', (req, res) => {
    const inputFilePath=req.body.inputFilePath;
    const outputFilePath=req.body.outputFilePath;
    console.log(inputFilePath);
    console.log(outputFilePath);
    if (!inputFilePath || !outputFilePath){
    res.status(400).send('Bad request:Missing File')}
    ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360')
    .on('end', () => res.status(200).send("conversion finished"))
    .on('error', err => {
        console.log('error: ', err.message)
        res.status(500).send('Internal Server Error:'+err.message)})
    .save(outputFilePath)
    .run();
>>>>>>> refs/remotes/origin/main

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
<<<<<<< HEAD

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
=======


    

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
>>>>>>> refs/remotes/origin/main
