import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DynamicTableTestModule from './DynamicTableTestModule';

function App() {

  return (
    <div className="App wrapper">
      <DynamicTableTestModule />
    </div>
  );
}

export default App;
