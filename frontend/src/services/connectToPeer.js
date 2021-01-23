import firebase from 'firebase.js'

async function createRoom() {
    const db = firebase.firestore()
    const roomRef = await db.collection('rooms').doc();
    console.log('Create PeerConnection with configuration: ', configuration);
    peerConnection = new RTCPeerConnection(configuration);
}

function registerPeerConnectionListeners() {
    
}