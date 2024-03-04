import React from 'react';
import Header from '../Header/Header';
import Details from './Details';
import Materials from './Materials';
import Brigade from './Brigade';

function AddingList() {
  return (
    <>
      <Header title={'Справочники'} />
      <Details />
      <Materials />
      <Brigade />
    </>
  );
}

export default AddingList;
