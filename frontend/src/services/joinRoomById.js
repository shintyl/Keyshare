
import firebase from './firebase.js'
import "firebase/firestore";

import configuration from './iceConfig'

async function joinRoomById(roomId) {
    const db = firebase.firestore()
    const roomRef = db.collection('rooms').doc(`${roomId}`)
    const roomSnapshot = await roomRef.get()
    console.log('Got room:', roomSnapshot.exists)

    if (roomSnapshot.exists) {
        console.log('Create PeerConnection with configuration: ', configuration)
        const peerConnection = new RTCPeerConnection(configuration)

        const calleeCandidatesCollection = roomRef.collection('calleeCandidates')
        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
                console.log("got final candidate")
            } else {
                console.log('Got candidate: ', event.candidate);
                calleeCandidatesCollection.add(event.candidate.toJSON());
            }
        }

        const offer = roomSnapshot.data().offer;
        console.log('Got offer:', offer);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        console.log('Created answer:', answer);
        await peerConnection.setLocalDescription(answer);

        const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp,
            },
        };
        await roomRef.update(roomWithAnswer);

        roomRef.collection('callerCandidates').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
                    await peerConnection.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });

        return new Promise((resolve, reject) => {
            peerConnection.ondatachannel = (event) => {
                event.channel.onopen = () => {
                    resolve(event.channel)
                }
                event.channel.binaryType = "arraybuffer";
            }
        })
    }
}

export default joinRoomById