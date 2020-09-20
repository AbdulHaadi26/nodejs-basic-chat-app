require('dotenv').config();
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var msgModel = mongoose.model('messages', {
    name: { type: String },
    message: { type: String }
})

app.get('/messages', async (req, res) => {
    var data = await msgModel.find();
    if (!data) res.sendStatus(500);
    res.send(data);
})

app.post('/messages', async (req, res) => {
    try {
        var message = new msgModel(req.body);
        var message = await message.save();
        if (!message) res.sendStatus(500);
        io.emit('message', req.body)
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
        console.log(e.message);
    }
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

//MongoDB Connection String
const mongoURI = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@dev-02rqv.mongodb.net/chat?retryWrites=true&w=majority`;

//Connect to Mongodb
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, async function (err) {
    if (err) console.log(err)
    else console.log('Connected to MongoDB');
});

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})