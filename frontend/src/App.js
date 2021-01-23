import backgroundPhoto from './resources/keyshare-bg.png';
import './App.css';
import React from "react";
import {createMuiTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {Button, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab"

const useStyles = makeStyles((theme) => ({
    backgroundDiv: {
        height: '100%',
        width: '100%',
        top: '0px',
        left:'0px',
        position: 'fixed',
    },
}));

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Pineapple Grass',
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
            <ToggleButtonGroup exclusive value={selection} onChange={updateSelection} aria-label="I am a">
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
          <Paper elevation={3}>
            <Grid container direction="column" justify="center" alignItems="center" p={3}>
              <Grid item>
                {{selection} === 'student' ?
                  <Typography variant='h4'>
                    Enter your room ID:
                  </Typography>
                  :
                  <Typography variant='h4'>
                    Use room ID:
                  </Typography>
                }
              </Grid>
              <Grid item>
	            <TextField name='roomId' variant='filled' size='small' required label='Room ID is required' onChange={updateValues}/>
              </Grid>
              <Grid>
                <Button variant="contained"> Connect </Button>
              </Grid>
            </Grid>
          </Paper>
        </div>
        <div className="Instructions">
          <Paper elevation={3}>
            <Typography variant='h6'>Instructions:</Typography>
            <Typography variant='h6'>1) Enter your instructor's room code above (which they should give you)</Typography>
            <Typography variant='h6'>2) Connect into the room by pressing the connect button</Typography>
            <Typography variant='h6'>3) Plug in your keyboard to your computer, and start playing.</Typography>
          </Paper>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
