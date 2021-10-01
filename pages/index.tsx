import type { NextPage } from 'next';
import { useState } from 'react';

import FinalForm from 'components/forms/FinalForm';
import FormikForm from 'components/forms/Formik';
import RadioGroup from 'components/plan/RadioGroup/RadioGroup';

const formik = 'formik';
const options = [
  { value: formik, label: 'Formik' },
  { value: 'final', label: 'Final form' },
];
const Home: NextPage = () => {
  const [selected, setSelected] = useState(formik);

  return (
    <>
      <RadioGroup options={options} onChange={setSelected} selected={selected} />
      {selected === formik ? (
        <>
          <h3>Formik</h3>
          <FormikForm />
        </>
      ) : (
        <>
          <h3>Final form</h3>
          <FinalForm />
        </>
      )}
    </>
  );
};

export default Home;
