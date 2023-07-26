import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
const port = 3001;

// Make sure to setup express.json() middleware before your routes.
app.use(express.json());


app.post('/process-video', (req, res) => {
    const inputFilePath=req.body.inputFilePath;
    const outputFilePath=req.body.outputFilePath;
    if (!inputFilePath || !outputFilePath){
    res.status(400).send('Bad request:Missing File')}
    ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360')
    .on('end', () => console.log('Conversion ended'))
    .on('error', err => {
        console.log('error: ', err.message)
        res.status(500).send('Internal Server Error:'+err.message)})
    .save(outputFilePath)
    .run();

});
    

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
