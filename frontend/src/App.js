import backgroundPhoto from './resources/keyshare-bg.png';
import './App.css';
import React from "react";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {Button, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    backgroundDiv: {
        height: '100%',
        width: '100%',
        top: '0px',
        left:'0px',
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

  const updateValues = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  }

  const [selection, setSelection] = React.useState('student');

  const updateSelection = (event, newSelection) => {
    setSelection(newSelection);
  }

  const classes = useStyles();

  return (
    <ThemeProvider theme = {theme}>
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
          <img src={backgroundPhoto} alt="Background" className={classes.backgroundDiv} style={{zIndex:-1}}/>
          {selection === "student" ?
            <div>
              <Typography variant='h4' className={classes.entryId}>
                Enter your room ID:
              </Typography>
              <TextField className={classes.fillText} name='roomId' variant='filled' size='small' required label='Room ID is required' onChange={updateValues}/>
            </div>
            :
            <div>
              <Typography variant='h4' className={classes.entryId}>
                Use room ID:
              </Typography>
              <TextField className={classes.fillText} name='genRoomId' variant='filled' size='small' label='Your room ID (read-only)' defaultValue="Hello World" InputProps={{readOnly: true,}}/>
            </div>
          }
          <Button variant="contained">
            Connect
	      </Button>
        </div>
        <div className="Instructions">
          <Paper elevation={10}>

            <Typography className="topInstruction" variant='h6'><b>Instructions:</b></Typography>
            <Typography variant='h6'>1) Enter your instructor's room code above (which they should give you)</Typography>
            <Typography variant='h6'>2) Connect into the room by pressing the connect button</Typography>
            <Typography className="bottomInstruction" variant='h6'>3) Plug in your keyboard to your computer, and start playing.</Typography>

            {selection === "student" ?
              <div>
                <Typography className="topInstruction" variant='h6'>
                  Instructions:
                </Typography>
                <Typography variant='h6'>
                  1) Enter your instructor's room code above (which they should give you)
                </Typography>
                <Typography variant='h6'>
                  2) Connect into the room by pressing the connect button
                </Typography>
                <Typography className="bottomInstruction" variant='h6'>
                  3) Plug your MIDI instrument into your computer, and start playing.
                </Typography>
              </div>
              :
              <div>
                <Typography className="topInstruction" variant='h6'>
                  Instructions:
                </Typography>
                <Typography variant='h6'>
                  1) Give your student the auto-generated room code above.
                </Typography>
                <Typography variant='h6'>
                  2) Wait until they connect, at which point you will be automatically redirected.
                </Typography>
                <Typography className="bottomInstruction" variant='h6'>
                  3) Wait for your student to plug their MIDI instrument in, and start listening.
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
