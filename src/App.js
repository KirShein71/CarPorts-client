import React from 'react';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import { check as checkAuth } from './http/userApi';
import axios from 'axios';
import { observer } from 'mobx-react';
import { Spinner } from 'react-bootstrap';

import './app.scss'






const App = observer(() => {
    const { user } = React.useContext(AppContext)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        Promise.all([checkAuth()])
            .then(
                axios.spread((userData) => {
                    if (userData) {
                        user.login(userData)
                    }
                })
            )
            .finally(
                () => setLoading(false)
            )
    }, [])


    if (loading) {
        return <Spinner />
    }
    
  return (
    <div className='wrapper'>
        <div className='container'>
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
        </div>
    </div>
  );
})

export default App;
