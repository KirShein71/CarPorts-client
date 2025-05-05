import React from 'react';
import Header from '../Header/Header';
import Details from './Details';
import Materials from './Materials';
import Brigade from './Brigade';
import Service from './Service';
import Supplier from './Supplier';

function AddingList() {
  return (
    <>
      <Header title={'Справочники'} />
      <Details />
      <Materials />
      <Supplier />
      <Brigade />
      <Service />
    </>
  );
}

export default AddingList;
