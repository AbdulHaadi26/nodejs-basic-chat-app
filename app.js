var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jane', message: 'Hello'}
]

app.get('/messages', (req, res) =>{
    res.send(messages)
})

app.post('/messages', (req, res) =>{
    messages.push(req.body)
    io.emit('message', req.body)
    res.sendStatus(200)
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

//MongoDB Connection String
const mongoURI = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@dev-02rqv.mongodb.net/development?retryWrites=true&w=majority`;

//Connect to Mongodb
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, async function (err) {
    if (err) console.log(err)
    else console.log('Connected to MongoDB');
});

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})