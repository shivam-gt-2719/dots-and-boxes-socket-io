const express = require('express')
const app = express()

//middlewares
app.use(express.static('public'))

//Listen on port 3000
server = app.listen(3000)

const io = require("socket.io")(server)
    
//listen on every connection
io.on('connection', (socket) => {
        //add function to receive and emit response
        socket.on('click-line', (data) => {
            console.log('clicked line', data);
            socket.broadcast.emit('clicked-line', data);
        });
})