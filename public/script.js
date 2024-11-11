// Establish socket connection
const socket = io();
let localStream;
let peerConnection;

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
    ]
};

console.log("Start button clicked");  // Place at the start of startButton.onclick function

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');

startButton.onclick = async () => {
    startButton.disabled = true;
    console.log("Start button clicked");
    await startLocalStream();
    initializePeerConnection();
    startCall();
};

// Function to get user media (camera and microphone)
async function startLocalStream() {
    try {
        console.log("Requesting local media stream...");
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (localStream) {
            localVideo.srcObject = localStream;
            console.log("Local video stream started");
        } else {
            console.error("Failed to get local stream.");
        }
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

// Function to initialize the peer connection
function initializePeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);
    console.log("Peer connection created");

    // Add local tracks to peer connection
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Handle remote track
    peerConnection.ontrack = (event) => {
        console.log("Remote track received");
        remoteVideo.srcObject = event.streams[0];
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("Sending ICE candidate");
            socket.emit('ice-candidate', event.candidate);
        }
    };
}

// Function to create and send an offer to start the call
async function startCall() {
    if (!peerConnection) initializePeerConnection();

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("Offer created and sent");
    socket.emit('offer', offer);
}

// Listen for offer from another user and respond with an answer
socket.on('offer', async (offer) => {
    if (!peerConnection) initializePeerConnection();

    console.log("Received offer");
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    console.log("Answer created and sent");
    socket.emit('answer', answer);
});

// Listen for answer from the other user to complete the connection
socket.on('answer', (answer) => {
    console.log("Received answer");
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

// Listen for ICE candidates from the other user
socket.on('ice-candidate', (candidate) => {
    console.log("Received ICE candidate");
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

