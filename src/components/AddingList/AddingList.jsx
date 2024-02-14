import React from 'react';
import Header from '../Header/Header';
import Details from './Details';
import Brigade from './Brigade';

function AddingList() {
  return (
    <>
      <Header title={'Создание деталей и монтажных бригад'} />;
      <Details />
      <Brigade />
    </>
  );
}

export default AddingList;
