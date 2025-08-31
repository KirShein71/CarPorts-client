import React from 'react';
import { Table } from 'react-bootstrap';
import Header from '../Header/Header';

function ReportProjects() {
  return (
    <div className="report-projects">
      <Header title={'Подписано/Сдано'} />
      <Table bordered>
        <thead>
          <tr>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default ReportProjects;
