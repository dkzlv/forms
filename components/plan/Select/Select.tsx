import React from 'react';
import { Option } from '../types';

export const Select: React.FC<
  {
    label: string;
    options?: Option[] | null;
    value?: string;
  } & JSX.IntrinsicElements['select']
> = ({ options, label, ...props }) => {
  const id = Math.random().toString();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select {...props} id={id} disabled={!options}>
        {options && <Options options={options} />}
      </select>
    </div>
  );
};

export const Options: React.FC<{
  options: Option[];
}> = ({ options }) => {
  return (
    <>
      <option value=''>---</option>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </>
  );
};
