import backgroundPhoto from './resources/keyshare-bg.png';
import './App.css';

import React, { useEffect } from "react";

import createRoom from "./services/createRoom"
import joinRoomById from "./services/joinRoomById"

import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {Button, Paper, TextField, Typography} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Piano, KeyboardShortcuts, MidiNumbers } from './components/react-piano';
import 'react-piano/dist/styles.css';
import SoundfontProvider from "./components/react-piano/SoundfontProvider";
import getInputsAndOutputs from "./services/midiHandler";

const useStyles = makeStyles((theme) => ({
  backgroundDiv: {
    height: '100%',
    width: '100%',
    top: '0px',
    left: '0px',
    position: 'fixed',
  },
  entryId: {
    fontSize: "0.8em",
  },
  fillText: {
    padding: "10px",
  }
}));

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'American Typewriter',
    ],
  },
});

const audioContext = new window.AudioContext();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

function App() {
  const [dataConnection,   setDataConnection]   = React.useState(null);
  const [isConnectionOpen, setIsConnectionOpen] = React.useState(false);
  const [roomKey,          setRoomKey]          = React.useState("");
  const [roomId,           setRoomId]           = React.useState("");
  const [selection,        setSelection]        = React.useState('student');
  const [voiceStatus,      setVoiceStatus]      = React.useState(true);
  const [hearingStatus,    setHearingStatus]    = React.useState(true);

  const updateValues = (event) => {
    if(event.target.value === roomKey){
      window.alert('Your room ID cannot be your own teacher ID.');
      return;
    }
    setRoomId(event.target.value);
  };

  useEffect(() =>
    {
    createRoom()
      .then(response =>
      {
        setDataConnection(response.dataConnection);
        setRoomKey(response.roomId);
      })
    },[]
  );

  const [RTCInput, setRTCInput] = React.useState({
    onrtcmessage: (msg) => null
  });

  useEffect(() => {
    if (dataConnection) {
      dataConnection.onmessage = (event) => {
        // if (!isConnectionOpen) {
        //   setIsConnectionOpen(true)
        // }
        if(hearingStatus) {
          RTCInput.onrtcmessage({
            data: Array.from(new Uint8Array(event.data)),
            receivedTime: 0
          });
        }
        console.log('received outer');
      };
      console.log(dataConnection.readyState);
    }
  }, [dataConnection, isConnectionOpen, RTCInput, hearingStatus]);

  const updateSelection = (event, newSelection) => {
    setSelection(newSelection);
    setCopied(false);
  };

  const updateVoiceStatus = (event) => {
        setVoiceStatus(!voiceStatus);
        //Implement muting here thanks
  }

  const updateHearingStatus = (event) => {
        setHearingStatus(!hearingStatus);
        //Implement deafening here thanks
  }

  const classes = useStyles();
  
  const [copied, setCopied] = useState(false);

  const firstNote = MidiNumbers.fromNote('a0');
  const lastNote = MidiNumbers.fromNote('c8');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: MidiNumbers.fromNote('g2'),
    lastNote: MidiNumbers.fromNote('f5'),
    keyboardConfig: KeyboardShortcuts.BOTTOM_ROW.concat(KeyboardShortcuts.QWERTY_ROW),
  });

  const getMidiInput = getInputsAndOutputs(
      (access) => access.inputs
  );


  const handleClickConnectButton = () => {
    console.log(roomId);
    if(roomId) {
      joinRoomById(roomId).then(
        response => {
          console.log('test');
          setDataConnection(response);
          setIsConnectionOpen(true);
        }
      )
    }
  };

  const sendyMIDI = (statusB) => (dataBM, dataBL) => {
    if(dataConnection && dataConnection.readyState === 'open' && voiceStatus) {
      const buffer = new ArrayBuffer(3);
      const view = new Uint8Array(buffer);
      view[0] = statusB;
      view[1] = dataBM;
      view[2] = dataBL;
      dataConnection.send(buffer);
    }
  };

  const sendNoteDown = sendyMIDI(0x90); //event 1001
  const sendNoteUp   = sendyMIDI(0x80); //event 1000

  return (
    <ThemeProvider theme = {theme}>
    <div className="App">
      <img src={backgroundPhoto} alt="Background" className={classes.backgroundDiv} style={{zIndex:-1}}/>
      <Router>
        <Switch>
          <Route exact path="/">
            <header className="App-header">
              <div className="Selector">
                <ToggleButtonGroup exclusive value={selection} onChange={updateSelection} aria-label="userStatus">
                  <ToggleButton value="student" aria-label="left aligned">
                    Student
                  </ToggleButton>
                  <ToggleButton value="teacher" aria-label="right aligned">
                    Teacher
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </header>
            <div className="Body">
              {selection === "student" ?
                  <Typography variant='h4' className={classes.entryId}>
                    Enter your room ID:
                  </Typography>
                  :
                  <Typography variant='h4' className={classes.entryId}>
                    Use this room ID:
                  </Typography>
              }
              <div className = "enterIdBox">
                {selection === "student" ?
                    <TextField name='roomId' variant='filled' value={roomId} required onChange={updateValues}/>
                    :
                    <TextField name='genRoomId' variant='filled' value={roomKey} InputProps={{readOnly: true,}}/>
                }
              </div>
              {selection === "student" ?
                  <Button variant="contained" onClick={handleClickConnectButton}>
                    Connect
                  </Button>
                  :
                  copied ?
                      <CopyToClipboard text={roomKey} onCopy={() => setCopied(true)}>
                        <div>
                          <Button variant="contained" color="primary">
                            Copied!
                          </Button>
                        </div>
                      </CopyToClipboard>
                      :
                      <CopyToClipboard text={roomKey} onCopy={() => setCopied(true)}>
                        <div>
                          <Button variant="contained">
                            Copy to Clipboard
                          </Button>
                        </div>
                      </CopyToClipboard>
              }
              <Link to="/piano"><Button>
                Piano
              </Button></Link>
            </div>
            <div className="Instructions">
              <Paper style={{marginLeft: "18%", marginRight: "18%"}} elevation={10}>
                {selection === "student" ?
                  <div>
                    <Typography className="topInstruction" variant='h6'>
                      <b>Instructions:</b>
                    </Typography>
                    <Typography variant='h6'>
                      1) Make sure your MIDI instrument is plugged into your computer and working.
                    </Typography>
                    <Typography variant='h6'>
                      2) Enter your instructor's room code above (they should provide this).
                    </Typography>
                    <Typography className="bottomInstruction" variant='h6'>
                      3) Connect into the room by pressing the connect button, and start playing.
                    </Typography>
                  </div>
                  :
                  <div>
                    <Typography className="topInstruction" variant='h6'>
                      <b>Instructions:</b>
                    </Typography>
                    <Typography variant='h6'>
                      1) Give your student the auto-generated room code above.
                    </Typography>
                    <Typography variant='h6'>
                      2) Wait until they connect, at which point you will be automatically redirected.
                    </Typography>
                    <Typography className="bottomInstruction" variant='h6'>
                      3) Have your student plug their MIDI instrument into their computer.
                    </Typography>
                  </div>
                }
              </Paper>
            </div>
          </Route>
          <Route path="/piano">
            <header className="App-header">
              <div className="Selector">
                <ToggleButtonGroup onChange={updateVoiceStatus} aria-label="userStatus">
                  <ToggleButton selected={!voiceStatus}>
                    {voiceStatus ? 'Unmuted' : 'Muted'}
                  </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup onChange={updateHearingStatus} aria-label="userStatus">
                  <ToggleButton selected={!hearingStatus}>
                    {hearingStatus ? 'Undeafened' : 'Deafened'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </header>
            <div className="Instructions">
              <SoundfontProvider
                instrumentName="acoustic_grand_piano"
                audioContext={audioContext}
                hostname={soundfontHostname}
                render={({ isLoading, playNote, stopNote }) => (
                  <Piano
                      noteRange={{ first: firstNote, last: lastNote }}
                      playNote={playNote}
                      stopNote={stopNote}
                      onPlayNoteInput={sendNoteDown}
                      onStopNoteInput={sendNoteUp}
                      width={1140}
                      keyboardShortcuts={keyboardShortcuts}
                      MIDIInput={getMidiInput}
                      RTCInput={setRTCInput}
                      selection={selection}
                  />
                )}
              />
            </div>
            <Link to="/"><Button>
              Exit Room
            </Button></Link>
          </Route>
        </Switch>
      </Router>
    </div>
    </ThemeProvider>
  );
}

export default App;
