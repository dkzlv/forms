import { Button, Control as RawControl, Input, Option, Select } from '@plan';
import { Form, useField, FieldRenderProps, useForm } from 'react-final-form';

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

const FinalForm: React.FC<{ projectId?: string }> = ({ projectId }) => {
  return (
    <Form<FormData>
      onSubmit={async (values) => {
        try {
          await sendRequest(values);
        } catch (error) {
          return {
            dlcName: 'Please change it, it is bad.',
          };
        }
      }}
      initialValues={{ projectId: projectId || '', releaseDate: '', dlcName: '' }}
      render={({ handleSubmit, submitting, values, pristine }) => {
        const projectSet = !!values.projectId;
        return (
          <form onSubmit={handleSubmit}>
            <ProjectId name='projectId' options={getProjectOptions()} />
            <DlcName projectSet={projectSet} name='dlcName' />
            <ReleaseDate projectSet={projectSet} name='releaseDate' />
            <Button
              disabled={
                pristine ||
                submitting ||
                !(values.projectId && values.dlcName && values.releaseDate)
              }>
              Submit
            </Button>
          </form>
        );
      }}
    />
  );
};

const ProjectId: FieldComponent<{ options: Option[] }> = ({ name, options }) => {
  const { input, meta } = useField<string>(name);

  return (
    <Control meta={meta}>
      <Select label='Project' options={options} {...input} />
    </Control>
  );
};

const DlcName: FieldComponent<{ projectSet: boolean }> = ({ name, projectSet }) => {
  const { input, meta } = useField(name, { validate: minLengthValidate });
  const { change, resetFieldState } = useForm();
  const [help, setHelp] = useState<string>();

  const fetchSuggestion = useCallback(
    (newProjectIdValue?: string) => {
      resetFieldState(name);
      change(name, '');
      if (newProjectIdValue) {
        setHelp('Loading name idea...');
        getProjectNextDLC().then((res) => {
          setHelp(`Maybe, this? "${res}". It cannot be "Oblivion".`);
        });
      } else {
        setHelp(undefined);
      }
    },
    [change, name, resetFieldState]
  );
  useParentChangeReset({ parentName: 'projectId', callback: fetchSuggestion });

  return (
    <Control meta={meta} help={help || 'Gorgeous name for your new DLC'}>
      <Input label='DLC name' disabled={!projectSet || !help} {...input} />
    </Control>
  );
};

const ReleaseDate: FieldComponent<{ projectSet: boolean }> = ({ name, projectSet }) => {
  const validate = useMemo(() => minDate(new Date()), []);

  const { input, meta } = useField<Date>(name, { validate });
  const { change } = useForm();

  const reset = useCallback(() => {
    change(name, '');
  }, [change, name]);
  useParentChangeReset({ parentName: 'projectId', callback: reset });

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      input.onChange(e);
      change(name, e.currentTarget.valueAsDate);
    },
    [change, input, name]
  );

  return (
    <Control meta={meta}>
      <Input
        label='Release date'
        type='date'
        {...input}
        disabled={!projectSet}
        onChange={onChange}
        value={input.value ? formatDateForInput(input.value) : ''}
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
  const { input } = useField<Date>(parentName);

  const prevProjectIdValue = useRef<string>();
  useEffect(() => {
    if (prevProjectIdValue.current !== input.value) {
      prevProjectIdValue.current = input.value;
      callback(input.value);
    }
  }, [callback, input.value]);
}

const minLengthValidate = minLength(5);

function Error<T>({ meta }: { meta: FieldRenderProps<T>['meta'] }) {
  const error = meta.error || meta.submitError;
  return error && meta.touched ? <span>{error}</span> : null;
}

function Control<T>(
  props: React.ComponentProps<typeof RawControl> & { meta: FieldRenderProps<T>['meta'] }
) {
  return <RawControl {...props} error={<Error meta={props.meta} />} />;
}

export default FinalForm;
