import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Pages/App';
import Login from './Pages/Login';
import Setup from './Pages/Setup';
import CreateApartment from './Pages/CreateApartment';
import JoinCode from './Pages/JoinCode';
import Notification from './Pages/Notification';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Login />
    <Setup />
    <CreateApartment />
    <JoinCode />
    <Notification />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
