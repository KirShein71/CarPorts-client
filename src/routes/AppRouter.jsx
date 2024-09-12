import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Home from '../pages/Home';
import Production from '../pages/Production';
import Payment from '../pages/Payment';
import Project from '../pages/Project';
import Team from '../pages/Team';
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
import Admin from '../pages/Admin';
import WorkingPage from '../pages/Workingpage';
import Adding from '../pages/Adding';
import ClientAccount from '../pages/ClientAccount';
import CreateInformationClient from '../pages/CreateInformationClient';
import ViewingPersonalAccount from '../pages/ViewingPersonalAccount';
import FinishProject from '../pages/FinishProject';
import ChangeBrigadeDate from '../pages/ChangeBrigadeDate';

import { observer } from 'mobx-react';

const userRoutes = [
  { path: '/personalaccount', Component: PersonalAccount },
  { path: '/', Component: Home },
];

const employeeRoutes = [
  { path: '/', Component: Home },
  { path: '/production', Component: Production },
  { path: '/payment', Component: Payment },
  { path: '/project', Component: Project },
  { path: '/team', Component: Team },
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
  { path: '/clientaccount', Component: ClientAccount },
  { path: '/createinformationclient/:id', Component: CreateInformationClient },
  { path: '/createaccount', Component: CreateAccount },
  { path: '/adding', Component: Adding },
  { path: '/workingpage', Component: WorkingPage },
  { path: '/finishproject', Component: FinishProject },
  { path: '/viewingpersonalaccount/:id', Component: ViewingPersonalAccount },
  { path: '/changebrigadedate', Component: ChangeBrigadeDate },
];

const adminRoutes = [
  { path: '/', Component: Home },
  { path: '/production', Component: Production },
  { path: '/payment', Component: Payment },
  { path: '/project', Component: Project },
  { path: '/team', Component: Team },
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
  { path: '/createinformationclient/:id', Component: CreateInformationClient },
  { path: '/clientaccount', Component: ClientAccount },
  { path: '/personalaccount', Component: PersonalAccount },
  { path: '/admin', Component: Admin },
  { path: '/workingpage', Component: WorkingPage },
  { path: '/adding', Component: Adding },
  { path: '/finishproject', Component: FinishProject },
  { path: '/viewingpersonalaccount/:id', Component: ViewingPersonalAccount },
  { path: '/changebrigadedate', Component: ChangeBrigadeDate },
];

const routes = [{ path: '/', Component: Home }];

const AppRouter = observer(() => {
  const { user } = React.useContext(AppContext);

  return (
    <Routes>
      {user.isUser &&
        userRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {user.isAdmin &&
        adminRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {user.isEmployee &&
        employeeRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
});

export default AppRouter;
