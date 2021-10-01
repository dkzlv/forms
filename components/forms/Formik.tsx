import { Button, Control as RawControl, Input, Option, Select } from '@plan';
import { Formik, Form, useField, ErrorMessage } from 'formik';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  sendRequest,
  getProjectOptions,
  formatDateForInput,
  getProjectNextDLC,
  minLength,
  minDate,
  FormData,
} from './common';

type FieldComponent<T = {}> = React.FC<T & { name: string }>;

const FormikForm: React.FC<{ projectId?: string }> = ({ projectId }) => {
  return (
    <Formik<FormData>
      initialValues={{ projectId: projectId || '', releaseDate: '', dlcName: '' }}
      onSubmit={(values, { setSubmitting, setFieldError }) =>
        sendRequest(values)
          .catch(() => setFieldError('dlcName', 'Please change it, it is bad.'))
          .finally(() => setSubmitting(false))
      }>
      {({ values, isSubmitting }) => (
        <Form>
          <ProjectId name='projectId' options={getProjectOptions()} />
          <DlcName name='dlcName' />
          <ReleaseDate name='releaseDate' />
          <Button
            disabled={isSubmitting || !(values.projectId && values.dlcName && values.releaseDate)}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const ProjectId: FieldComponent<{ options: Option[] }> = ({ name, options }) => {
  const [field] = useField<string>(name);

  return (
    <Control name={name}>
      <Select label='Project' options={options} {...field} />
    </Control>
  );
};

const DlcName: FieldComponent = ({ name }) => {
  const [field, , helpers] = useField<string>({
    name,
    validate: minLengthValidate,
  });
  const [help, setHelp] = useState<string>();

  const fetchSuggestion = useCallback(
    (newProjectIdValue?: string) => {
      helpers.setValue('');
      helpers.setTouched(false);
      if (newProjectIdValue) {
        setHelp('Loading name idea...');
        getProjectNextDLC().then((res) => {
          setHelp(`Maybe, this? "${res}". It cannot be "Oblivion".`);
        });
      } else {
        setHelp(undefined);
      }
    },
    [helpers]
  );
  useParentChangeReset({ parentName: 'projectId', callback: fetchSuggestion });

  return (
    <Control name={name} help={help || 'Gorgeous name for your new DLC'}>
      <Input label='DLC name' disabled={!help} {...field} />
    </Control>
  );
};

const ReleaseDate: FieldComponent = ({ name }) => {
  const validate = useMemo(() => minDate(new Date()), []);

  const [field, , helpers] = useField<Date | null>({ name, validate });
  const [, projectIdMeta] = useField<string>('projectId');

  const reset = useCallback(() => {
    helpers.setTouched(false);
    helpers.setValue(null);
  }, [helpers]);

  useParentChangeReset({ parentName: 'projectId', callback: reset });

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      helpers.setTouched(true);
      helpers.setValue(e.currentTarget.valueAsDate);
    },
    [helpers]
  );

  return (
    <Control name={name}>
      <Input
        label='Release date'
        type='date'
        {...field}
        onChange={onChange}
        disabled={!projectIdMeta.value}
        value={field.value ? formatDateForInput(field.value) : ''}
      />
    </Control>
  );
};

function useParentChangeReset({
  parentName,
  callback,
}: {
  parentName: string;
  callback: (newValue?: string) => void;
}) {
  const [, parentFieldMeta] = useField(parentName);

  const prevProjectIdValue = useRef<string>();
  useEffect(() => {
    if (prevProjectIdValue.current !== parentFieldMeta.value) {
      prevProjectIdValue.current = parentFieldMeta.value;
      callback(parentFieldMeta.value);
    }
  }, [parentFieldMeta.touched, parentFieldMeta.value, callback]);
}

const minLengthValidate = minLength(5);

function Error({ name }: { name: string }) {
  return <ErrorMessage component='span' name={name as string} />;
}

function Control(props: React.ComponentProps<typeof RawControl> & { name: string }) {
  return <RawControl {...props} error={<Error name={props.name} />} />;
}

export default FormikForm;
