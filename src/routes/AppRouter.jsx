import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Home from '../pages/Home';
import Production from '../pages/Production';
import Project from '../pages/Project';
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
import InstallerAccount from '../pages/InstallerAccount';
import InstallationProjectInfo from '../pages/InstallationProjectInfo';
import InstallationFinishProject from '../pages/InstallationFinishProject';
import Distrbution from '../pages/Distribution';
import ViewingInstallationPage from '../pages/ViewingInstallationPage';
import Complaint from '../pages/Complaint';
import ComplaintProject from '../pages/ComplaintProject';
import InstallationComplaint from '../pages/InstallationComplaint';
import ViewingInstallationComplaintPage from '../pages/ViewingInstallationComplaintPage';
import Logistics from '../pages/Logistics';
import GantContract from '../pages/GantContact';

import { observer } from 'mobx-react';

const userRoutes = [
  { path: '/personalaccount', Component: PersonalAccount },
  { path: '/', Component: Home },
];

const employeeRoutes = [
  { path: '/', Component: Home },
  { path: '/production', Component: Production },
  { path: '/project', Component: Project },
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
  { path: '/project', Component: Project },
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
  { path: '/installeraccount', Component: InstallerAccount },
  { path: '/projectinformation/:id', Component: InstallationProjectInfo },
  { path: '/project-finish/:id', Component: InstallationFinishProject },
  { path: '/distribution', Component: Distrbution },
  { path: '/viewinginstallationpage/:id', Component: ViewingInstallationPage },
  { path: '/complaint', Component: Complaint },
  { path: '/complaint-project/:id', Component: ComplaintProject },
  { path: '/viewinginstallationcomplaintpage/:id', Component: ViewingInstallationComplaintPage },
  { path: '/logistics', Component: Logistics },
  { path: '/gant-contracts', Component: GantContract },
];

const managerSaleRoutes = [
  { path: '/project', Component: Project },
  { path: '/projectinfo/:id', Component: ProjectInfo },
  { path: '/createinformationclient/:id', Component: CreateInformationClient },
  { path: '/viewingpersonalaccount/:id', Component: ViewingPersonalAccount },
  { path: '/workingpage', Component: WorkingPage },
  { path: '/finishproject', Component: FinishProject },
  { path: '/clientaccount', Component: ClientAccount },
  { path: '/complaint', Component: Complaint },
  { path: '/complaint-project/:id', Component: ComplaintProject },
  { path: '/logistics', Component: Logistics },
];

const managerProjectRoutes = [
  { path: '/project', Component: Project },
  { path: '/projectinfo/:id', Component: ProjectInfo },
  { path: '/createinformationclient/:id', Component: CreateInformationClient },
  { path: '/viewingpersonalaccount/:id', Component: ViewingPersonalAccount },
  { path: '/workingpage', Component: WorkingPage },
  { path: '/finishproject', Component: FinishProject },
  { path: '/planning', Component: Planning },
  { path: '/production', Component: Production },
  { path: '/productionchange', Component: ProductionChange },
  { path: '/procurement', Component: Procurement },
  { path: '/welders', Component: Welders },
  { path: '/shipment', Component: Shipment },
  { path: '/shipmentchange', Component: ShipmentChange },
  { path: '/manufacture', Component: Manufacture },
  { path: '/ordermaterials', Component: OrderMaterials },
  { path: '/changebrigadedate', Component: ChangeBrigadeDate },
  { path: '/adding', Component: Adding },
  { path: '/distribution', Component: Distrbution },
  { path: '/complaint', Component: Complaint },
  { path: '/complaint-project/:id', Component: ComplaintProject },
  { path: '/logistics', Component: Logistics },
  { path: '/viewinginstallationpage/:id', Component: ViewingInstallationPage },
  { path: '/viewinginstallationcomplaintpage/:id', Component: ViewingInstallationComplaintPage },
];

const constructorRoutes = [{ path: '/planning', Component: Planning }];

const managerProductionRoutes = [
  { path: '/welders', Component: Welders },
  { path: '/manufacture', Component: Manufacture },
  { path: '/workingpage', Component: WorkingPage },
  { path: '/shipment', Component: Shipment },
  { path: '/shipmentchange', Component: ShipmentChange },
  { path: '/production', Component: Production },
  { path: '/ordermaterials', Component: OrderMaterials },
  { path: '/complaint', Component: Complaint },
  { path: '/complaint-project/:id', Component: ComplaintProject },
  { path: '/logistics', Component: Logistics },
];

const brigadesRoutes = [
  { path: '/installeraccount', Component: InstallerAccount },
  { path: '/projectinformation/:id', Component: InstallationProjectInfo },
  { path: '/project-finish', Component: InstallationFinishProject },
  { path: '/installation-complaint', Component: InstallationComplaint },
];

const routes = [
  { path: '/', Component: Home },
  { path: '/personalaccount', Component: PersonalAccount },
];

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
      {user.isBrigade &&
        brigadesRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {user.isManagerSale &&
        managerSaleRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {user.isManagerProject &&
        managerProjectRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

      {user.isConstructor &&
        constructorRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {user.isManagerProduction &&
        managerProductionRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
});

export default AppRouter;
