import React from 'react';
import logo from './logo.svg';
import './App.css';
import CameraHandler from "./Components/CameraHandler";

function App() {
  const [result, setResult ] = React.useState(null);
  const handleScan = (data: any) => {
    setResult(data)
  };

  const handleError = (err: any) => {
    console.error(err)
  };

  return (
    <div className="App">
      <CameraHandler/>
      <p>{result}</p>
    </div>
  );
}

export default App;
