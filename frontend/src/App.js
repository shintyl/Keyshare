import backgroundPhoto from './resources/keyshare-bg.png';
import './App.css';
import React, { useEffect } from "react";
import { createMuiTheme, makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import createRoom from "./services/createRoom"
import joinRoomById from "./services/joinRoomById"

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

function App() {
  const [values, setValues] = React.useState({
    roomId: '',
  });

  const [dataConnection, setDataConnection] = React.useState(null)
  const [isConnectionOpen, setIsConnectionOpen] = React.useState(false)

  const updateValues = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  }

  useEffect(() => {
    createRoom()
      .then(response => { setDataConnection(response) }
    )}, [])

  useEffect(() => {
    if (dataConnection) {
      dataConnection.onmessage = (event) => {
        if (!isConnectionOpen) {
          setIsConnectionOpen(true) 
        }
        console.log(event.data)
      }
    }
  }, [dataConnection, isConnectionOpen])

  const [selection, setSelection] = React.useState('student');

  const updateSelection = (event, newSelection) => {
    setSelection(newSelection);
  }

  const classes = useStyles();

  const handleClickConnectButton = () => {
    joinRoomById(values.roomId).then(
      response => {
        setDataConnection(response)
        setIsConnectionOpen(true)
        response.send("hello")
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
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
          <img src={backgroundPhoto} alt="Background" className={classes.backgroundDiv} style={{ zIndex: -1 }} />
          {selection === "student" ?
            <Typography variant='h4' className={classes.entryId}>
              Enter your room ID:
            </Typography>
            :
            <Typography variant='h4' className={classes.entryId}>
              Use this room ID:
            </Typography>
          }
          <div className="enterIdBox">
            {selection === "student" ?
              <TextField name='roomId' variant='filled' value={values.roomId} required onChange={updateValues} />
              :
              <TextField name='genRoomId' variant='filled' value="X4YQ78NQ" InputProps={{ readOnly: true, }} />
            }
          </div>
          {dataConnection && dataConnection.readyState === 'open' ?
            <Button onClick={() => dataConnection.send(":)")}>send :)</Button>
            : null
          }
          {selection === "student" ?
            <Button variant="contained" onClick={handleClickConnectButton}>
              Connect
	        </Button>
            :
            <Button variant="contained">
              Copy to clipboard
	        </Button>
          }
        </div>
        <div className="Instructions">
          <Paper elevation={10}>
            {selection === "student" ?
              <div>
                <Typography className="topInstruction" variant='h6'>
                  <b>Instructions:</b>
                </Typography>
                <Typography variant='h6'>
                  1) Enter your instructor's room code above (they should provide this).
                </Typography>
                <Typography variant='h6'>
                  2) Connect into the room by pressing the connect button.
                </Typography>
                <Typography className="bottomInstruction" variant='h6'>
                  3) Plug your MIDI instrument into your computer, and start playing.
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
      </div>
    </ThemeProvider>
  );
}

export default App;
