import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Production from '../pages/Production';
import Suppliers from '../pages/Suppliers';
import Payment from '../pages/Payment';
import Deadline from '../pages/Deadline';
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
import Welders from '../pages/Welders';
import Shipment from '../pages/Shipment';
import ShipmentChange from '../pages/ShipmentChange';
import Manufacture from '../pages/Manufacture';
import CreateAccount from '../pages/CreateAccount';
import PersonalAccount from '../pages/PersonalAccount';
import Login from '../pages/Login';

const routes = [
  { path: '/', Component: Home },
  { path: '/production', Component: Production },
  { path: '/suppliers', Component: Suppliers },
  { path: '/payment', Component: Payment },
  { path: '/deadline', Component: Deadline },
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
  { path: '/welders', Component: Welders },
  { path: '/shipment', Component: Shipment },
  { path: '/shipmentchange', Component: ShipmentChange },
  { path: '/manufacture', Component: Manufacture },
  { path: '/createaccount', Component: CreateAccount },
  { path: '/personalaccount', Component: PersonalAccount },
  { path: '/login', Component: Login },
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
