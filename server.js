// new-user-joined,user-joined,send.. custom events
// Node server which will handle socket io connections
const express = require('express')
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 8000


app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())



// create Routing
app.get('/',(req,res) =>{
            // send index file
            res.sendFile(__dirname+'/index.html');
    })
    
    
    const users = {};
    
    const io = require('socket.io')(http)
io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        // emit event to all user except newly join user

        socket.broadcast.emit('user-joined', name);
        console.log('connected...')
    });
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        // emit event to all user except newly join user
        socket.emit('welcome', name);
        
    });
    
    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        // receive by all users.  {objects} 
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

// To Sart Server
http.listen(PORT,() =>{
    console.log(`Listening on port ${PORT}`);
});