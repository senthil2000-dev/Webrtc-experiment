var clientSocket=io.connect("http://localhost:3000");
var chat = document.getElementById('chat');
var user = document.getElementById('user');
var post = document.getElementById('put');
var broadcast = document.getElementById('broadcast');
var typed = document.getElementById('typing');

post.addEventListener('click', function () {
    clientSocket.emit('chat', {
        chatText: chat.value,
        user: user.value
    });
});
chat.addEventListener('keypress', function () {
    clientSocket.emit('typing', user.value);
});
clientSocket.on('chat', function(toShow) {
    typed.innerHTML='';
    broadcast.innerHTML+='<p><strong>'+toShow.user+':</strong>'+toShow.chatText+'</p>';
});
clientSocket.on('typing', function(typist) {
    typed.innerHTML="<p><em>"+typist+" is typing a message</em></p>";
});