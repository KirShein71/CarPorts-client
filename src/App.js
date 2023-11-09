import React from 'react';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';

import './app.scss'




const App = () => {
  return (
    <div className='wrapper'>
        <div className='container'>
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
        </div>
    </div>
  );
}

export default App;
