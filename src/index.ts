// projectData = {};

const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const port =8000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('website'));

const cors = require('cors');

app.use(cors());

app.post("/add", async function(){
    // const body = await req.body
    // projectData = body;
    // console.log(projectData);
    // res.status(200).send(projectData);
});

app.get("/all", async() =>{
    // console.log(projectData);
    // res.send(projectData);
});


app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
});