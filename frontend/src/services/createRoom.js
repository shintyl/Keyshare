import firebase from './firebase.js'
import "firebase/firestore";

import configuration from './iceConfig'

async function createRoom() {
    const db = firebase.firestore()
    const roomRef = await db.collection('rooms').doc();

    console.log('Create PeerConnection with configuration: ', configuration);
    const peerConnection = new RTCPeerConnection(configuration);
    const dataConnection = peerConnection.createDataChannel("channel")
    const callerCandidateCollection = roomRef.collection('callerCandidates')
    peerConnection.onicecandidate = (event) => {
        if (!event.candidate) {
            console.log('got final candidate')
            return
        } else {
            console.log("got candidate: ", event.candidate)
            callerCandidateCollection.add(event.candidate.toJSON())
        }
    }

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    console.log("created offer:", offer)

    const roomWithOffer = {
        'offer': {
            type: offer.type,
            sdp: offer.sdp,
        },
    };
    await roomRef.set(roomWithOffer);

    console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);

    roomRef.onSnapshot(async snapshot => {
        const data = snapshot.data()
        if (!peerConnection.currentRemoteDescription && data && data.answer) {
            console.log('Got remote description: ', data.answer);
            const rtcSessionDescription = new RTCSessionDescription(data.answer);
            await peerConnection.setRemoteDescription(rtcSessionDescription);
        }
    })

    roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
                let data = change.doc.data();
                console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
                await peerConnection.addIceCandidate(new RTCIceCandidate(data));
            }
        });
    });

    return dataConnection
}

export default createRoom