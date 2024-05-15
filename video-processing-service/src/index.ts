import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
const port=process.env.port||3001;


app.use(express.json());


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

});


    

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));