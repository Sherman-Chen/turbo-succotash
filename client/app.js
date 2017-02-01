$(document).ready(() => {
  console.log('jQuery enabled');
  // socket connection
  const socket = io.connect();
  const $chat = $('#chat');
  // $message consts
  const $messageForm = $('#messageForm');
  const $message = $('#message');
  const $messageArea = $('#messageArea');
  // $user consts
  const $userFormArea = $('#userFormArea');
  const $userForm = $('#userForm');
  const $users = $('#users');
  const $username = $('#username');

  // $message actions & socket emissions
  $messageForm.submit((e) => {
    e.preventDefault();
    console.log('msg submitted');
    socket.emit('send message', $message.val());
    $message.val(' ');
  });

  // $user actions & socket emissions
  $userForm.submit((e) => {
    e.preventDefault();
    console.log('new user created');
    socket.emit('new user', $username.val(), (data) => {
      if (data) {
        console.log('new user data: ', data);
        $userFormArea.hide();
        $messageArea.show();
      }
    });
    $username.val(' ');
  });

  // sockets real time event handling
  socket.on('new message', (data) => {
    console.log(data);
    $chat.append(`<div class="well"><strong>${data.user}</strong>: ${data.message}</div>`);
  });

  socket.on('get users', (data) => {
    let html ='';
    for (let i = 0; i < data.length; i++) {
      html += `<li class="list-group-item">${data[i]}</li>`;
    }
    $users.html(html);
  });

});