// socket connection
const socket = io.connect('http://localhost:3500');

// Node Elements of client
let loginContainer = document.getElementById('login-container');
let chatContainer = document.getElementById('chat-container');
let userNameElement = document.getElementById('userNameInput');
let loginButton = document.getElementById('loginButton');
const chatboxHeader = document.getElementById('chatboxHeader');
const textArea = document.getElementById('textArea');
let userLength = document.getElementById('usersLength');
const currentUserList = document.getElementById('currentUserList');
let userInput = document.getElementById('userInput');
let chatButton = document.getElementById('chatButton');



// Hide chatbox before login
chatContainer.style.display = 'none';


// Login functionalities
loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    let userName = userNameElement.value;
    if (userName) {
        console.log(userName);
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'block';

        // Login Event 
        socket.emit('newJoin', userName);

        // convert image file to url
        function previewFile() {
            const preview = document.getElementById("userImage");
            const file = document.getElementById('userImageInput').files[0];
            const reader = new FileReader();

            reader.addEventListener(
                "load",
                () => {
                    // convert image file to base64 string
                    preview.src = reader.result;
                },
                false,
            );

            if (file) {
                reader.readAsDataURL(file);
            }
        }

        previewFile();

        // Welcome Greeting
        let welcomeUser = document.createElement('span');
        welcomeUser.className = 'text-success fs-medium'
        welcomeUser.textContent = `Welcome ${userName}`;
        chatboxHeader.appendChild(welcomeUser);
        setTimeout(() => {
            welcomeUser.style.display = 'none'
        }, 4000)

        // Update available user list
        let userPresent = document.createElement('div');
        userPresent.className = 'text-center text-light border border-secondary p-1';
        userPresent.textContent = userName;
        currentUserList.appendChild(userPresent);

        // if (window.location.reload() || window.close()) {
        //     socket.emit('disconnect', userName);

        //     let leaveUser = document.createElement('div');
        //     leaveUser.textContent = `${userName} has left`;
        //     currentUserList.appendChild(leaveUser);
        // }

        userInput.addEventListener('focus', () => {
            userInput.style.border = 'none'
            userInput.style.outline = '0.5px solid green';

            // Typing message post
            socket.emit('typing', userName);

        });

        // Send new Message
        chatButton.addEventListener('click', (e) => {
            e.preventDefault();
            let message = userInput.value;
            if (message) {
                socket.emit('newMessage', message);

                let newMessage = document.createElement('div');
                let userInfo = document.createElement('div');
                userInfo.className = 'd-flex align-items-center justify-content-between';
                newMessage.appendChild(userInfo);

                let name = document.createElement('p');
                name.textContent = userName;
                userInfo.appendChild(name);

                let time = document.createElement('p');
                time.textContent = new Date().toTimeString().slice(0, 5);
                userInfo.appendChild(time);

                let text = document.createElement('p');
                text.textContent = message;
                newMessage.appendChild(text);


                newMessage.className = 'mb-1 p-1 text-end bg-primary text-light fw-bold';
                textArea.appendChild(newMessage);

                userInput.value = '';
            }
        })
    }
});


// All broadcast events
socket.on('incrementUser', (userLen) => {
    userLength.textContent = userLen;
})

socket.on('newMember', (user) => {
    let welcomeUser = document.createElement('div');
    welcomeUser.className = 'text-primary'
    welcomeUser.textContent = `${user.userName} has Joined the chat`;
    textArea.appendChild(welcomeUser);

    userLength.textContent = user.totalUser;

    let userPresent = document.createElement('div');
    userPresent.className = 'text-center text-light border border-secondary p-1';
    userPresent.textContent = user.userName;
    currentUserList.appendChild(userPresent);
});

socket.on('incomingChat', (userName) => {
    let typing = document.createElement('span');
    typing.className = 'text-success p-1'
    typing.textContent = `${userName} typing...`
    chatboxHeader.appendChild(typing);
    setTimeout(() => {
        typing.style.display = 'none';
    }, 4000);
})

socket.on('message', (data) => {
    let newMessage = document.createElement('div');
    let userInfo = document.createElement('div');
    userInfo.className = 'd-flex align-items-center justify-content-between';
    newMessage.appendChild(userInfo);

    let name = document.createElement('p');
    name.textContent = data.userName;
    userInfo.appendChild(name);

    let time = document.createElement('p');
    time.textContent = data.timeStamp.slice(14, 19);
    userInfo.appendChild(time);

    let text = document.createElement('p');
    text.textContent = data.message;
    newMessage.appendChild(text);


    newMessage.className = 'mb-1 p-1 text-end bg-warning text-dark fw-bold';
    textArea.appendChild(newMessage);
})

// socket.on('userLeft', (user) => {
//     userLength.textContent = user.totalUser;
//     currentUserList.forEach((child) => {
//         if (child.value == user.userName) {
//             child.style.display = 'none';
//         }
//     })

// })


