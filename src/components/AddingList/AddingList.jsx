import React from 'react';
import Header from '../Header/Header';
import Details from './Details';
import Materials from './Materials';
import Brigade from './Brigade';
import Service from './Service';

function AddingList() {
  return (
    <>
      <Header title={'Справочники'} />
      <Details />
      <Materials />
      <Brigade />
      <Service />
    </>
  );
}

export default AddingList;
