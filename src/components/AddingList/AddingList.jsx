import React from 'react';
import Header from '../Header/Header';
import Details from './Details';
import Materials from './Materials';
import Brigade from './Brigade';
import Service from './Service';
import Supplier from './Supplier';
import Examination from './Examination';
import Designer from './Designer';

function AddingList() {
  return (
    <>
      <Header title={'Справочники'} />
      <Details />
      <Materials />
      <Supplier />
      <Brigade />
      <Designer />
      <Service />
      <Examination />
    </>
  );
}

export default AddingList;
