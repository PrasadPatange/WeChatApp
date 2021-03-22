// const socket = io('http://localhost:8000');//to connect with nodeServer
const socket = io('https://wechat-app-prasad.herokuapp.com/');//to connect with nodeServer

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// Audio that will play on receiving messages
var audio = new Audio('/static/ting.mp3');

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');//div in html
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
// 
    if(position =='left'){ 
        audio.play();
    }
   else if(position =='join'){ 
        audio.play();
    }
}


// Ask new user for his/her name and let the server know
    const name = prompt("Please Enter your name to join");
    socket.emit('new-user-joined', name);


// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name}  joined the chat`, 'join')
    scrollToBottom();
})
// If a new user joins, receive his/her name with welcome Messsage from the server
socket.on('welcome', name =>{
    append(`Welcome To WeChat ${name}`, 'welcome')
    scrollToBottom();
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}:\n ${data.message}`, 'left')

    scrollToBottom();
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name}  left the chat`, 'leave')
    scrollToBottom();
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();//without loading page
    const message = messageInput.value;
    append(`You:\n ${message}`, 'right');
    scrollToBottom();
    socket.emit('send', message);
    
    messageInput.value = ''//clear the message after Enter.
})


// Scroll Function auto scroll message.

function scrollToBottom(){
    messageContainer.scrollTop = messageContainer.scrollHeight;
}