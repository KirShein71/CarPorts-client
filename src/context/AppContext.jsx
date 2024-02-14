import React from 'react';
import UserStore from '../store/userStore';

const AppContext = React.createContext();

// контекст, который будем передавать
const context = {
  user: new UserStore(),
};

const AppContextProvider = (props) => {
  return <AppContext.Provider value={context}>{props.children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
