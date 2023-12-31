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
import ProductionChange from '../pages/ProductionChange';
import Planning from '../pages/Planning';
import OrderMaterials from '../pages/OrderMaterials';
import Installation from '../pages/Installation';
import Appoint from '../pages/Appoint';

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
  { path: '/productionchange', Component: ProductionChange },
  { path: '/planning', Component: Planning },
  { path: '/ordermaterials', Component: OrderMaterials },
  { path: '/installation', Component: Installation },
  { path: '/appoint', Component: Appoint },
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
