import backgroundPhoto from './resources/keyshare-bg.png';
import './App.css';
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Button, Paper, TextField, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    backgroundDiv: {
        height: '100%',
        width: '100%',
        top: '0px',
        left:'0px',
        position: 'fixed',
    },
}));

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

  const classes = useStyles();

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="Body">
        <img src={backgroundPhoto} alt="Background image" className={classes.backgroundDiv} style={{zIndex:-1}}/>
        <Typography variant='h4'>Enter your room ID:</Typography>
	    <TextField name='roomId' variant='filled' size='small' required label='Room ID is required' onChange={updateValues}/>
        <Button variant="contained">
          Connect
	    </Button>
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
  );
}

export default App;
