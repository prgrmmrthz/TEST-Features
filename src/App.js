import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DynamicTablePerRowTestModule from './DynamicTablePerRowTestModule';
import TestForm from './TestForm';

function App() {

  return (
    <div className="App wrapper">
      <TestForm />
    </div>
  );
}

export default App;
