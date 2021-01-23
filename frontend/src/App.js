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
        <img src={logo} className="App-logo" alt="logo" />
        <Typography variant='h4'>Room ID</Typography>
	<TextField name='roomId' onChange={updateValues} required label="required"/>
        <Button variant="contained" href = "./pages/temp.js">
          <Typography variant='h5'>Connect</Typography>
	    </Button>
      </header>
    </div>
  );
}

export default App;
