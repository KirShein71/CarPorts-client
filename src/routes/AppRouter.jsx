import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Production from '../pages/Production';
import Suppliers from '../pages/Suppliers';
import Payment from '../pages/Payment';
import Stock from '../pages/Stock';
import Deadline from '../pages/Deadline';
import Logistics from '../pages/Logistics';
import Project from '../pages/Project';
import Team from '../pages/Team';
import Desing from '../pages/Desing';
import Procurement from '../pages/Procurement';
import ProjectInfo from '../pages/ProjectInfo';

const routes = [
  { path: '/', Component: Home },
  { path: '/production', Component: Production },
  { path: '/suppliers', Component: Suppliers },
  { path: '/payment', Component: Payment },
  { path: '/stock', Component: Stock },
  { path: '/deadline', Component: Deadline },
  { path: '/logistics', Component: Logistics },
  { path: '/project', Component: Project },
  { path: '/team', Component: Team },
  { path: '/desing', Component: Desing },
  { path: '/procurement', Component: Procurement },
  { path: '/projectinfo/:id', Component: ProjectInfo },
];

function AppRouter() {
  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
}

export default AppRouter;
