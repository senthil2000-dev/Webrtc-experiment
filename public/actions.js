const vSocket=io('/');
const container = document.getElementById('videos');
const selfVid = document.createElement('video');
selfVid.muted = true;
const tracker={};
navigator.mediaDevices.getUserMedia({ video: true, audio: true})
.then(stream => {
    addUser(selfVid, stream);
    peer.on('call', (call)=> {
        call.answer(stream);
        const sentVideo = document.createElement('video');
        call.on('stream', sentStream => {
          addUser(sentVideo, sentStream);
        });
    });
    vSocket.on('initiate-newCall', (uId)=> {
        sendStream(stream, uId);
    });
});
const peer=new Peer(undefined, {host: '/', port: '3001'});
peer.on('open', (uId)=> {
    vSocket.emit('join-room', rId, uId);
})
vSocket.on('call-cut', (uId)=> {
    console.log(uId);
    if(tracker[uId]) {
        tracker[uId].close();
    }
});
function addUser(videoEl, stream) {
  videoEl.srcObject = stream;
  videoEl.addEventListener('loadedmetadata', () => {
    videoEl.play();
  })
  container.append(videoEl);
}
function sendStream(stream, uId) {
    setTimeout(function () {
        console.log('connecting..');
        const connection=peer.call(uId, stream);
        console.log(connection);
        const newVideo=document.createElement('video');
        connection.on('stream', (newStream)=> {
            console.log(2);
            addUser(newVideo, newStream);
        });
        console.log(connection);
        connection.on('close', () => {
            newVideo.remove();
        });
        tracker[uId]=connection;
    }, 3000);
}
