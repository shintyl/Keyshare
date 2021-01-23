import backgroundPhoto from './resources/keyshare-bg.png';
import './App.css';
import React from "react";
import ReactDOM from 'react-dom';
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

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
        <img src={backgroundPhoto} className={classes.backgroundDiv} style={{zIndex:0}}/>
        <Typography variant='h2'>KEYSHARE</Typography>
      </header>
      <div className="Body">
        <Typography variant='h4' style={{zIndex:1}}>Enter your room ID:</Typography>
	    <TextField name='roomId' onChange={updateValues} style={{zIndex:1},{color:"black"}}/>
        <Button variant="contained">
          <Typography variant='h5'>Connect</Typography>
	    </Button>
      </div>
    </div>
  );
}

export default App;
