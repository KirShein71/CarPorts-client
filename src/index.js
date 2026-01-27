import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppContextProvider } from './context/AppContext';



export const Context = createContext(null)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppContextProvider>
        <App />
    </AppContextProvider>
    
);


