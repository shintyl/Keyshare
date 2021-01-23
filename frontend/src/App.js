import logo from './resources/logo.svg';
import './App.css';
import React from "react";
import ReactDOM from 'react-dom';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

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

  return (
    <div className="App">
      <header className="App-header">
        <Typography variant='h2'>KEYSHARE</Typography>
      </header>
      <div className="Body">
        <Typography variant='h4'>Enter your room ID:</Typography>
	    <TextField name='roomId' onChange={updateValues}/>
        <Button variant="contained">
          <Typography variant='h5'>Connect</Typography>
	    </Button>
      </div>
    </div>
  );
}

export default App;
