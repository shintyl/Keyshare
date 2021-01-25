# Keyshare

Since the COVID-19 pandemic and resulting quarantine forced students and teachers to begin learning remotely, and trying to play music over video conferencing software can be both laggy and a terrible experience for your ears, we began searching for ways to stream music in MIDI form to amend this.

Keyshare resolves problems of latency, bandwidth, and audio quality by allowing student and teacher to connect on browser and stream MIDI data directly from the student's computer (via connected MIDI instrument) to the teacher's computer.

Keyshare's frontend is built in Javascript with React and managed by Node.js/npm. Although mainly centered around the material-ui framework, various other packages were crucial to the process, including - but not limited to - react-piano (which we wrote custom JS using low-level WebMIDI for), sound-font-player, lodash, and midimessage.

Keyshare uses WebRTC to transmit MIDI data between connected clients. Although a Firebase signaling server is used to negotiate the initial handshake between clients, after this handshake, all communication becomes peer-to-peer, preventing server-associated performance costs.

Built for [BoilerMake 2021](https://devpost.com/software/keyshare-rc7kja) at Purdue University
- Winner of First Place Overall
- Winner of Best use of Google Cloud
