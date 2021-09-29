import React from 'react';

export const Input: React.FC<Props> = ({ label, ...props }) => {
  const id = Math.random().toString();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input {...props} id={id} />
    </div>
  );
};

type Props = { label: string } & JSX.IntrinsicElements['input'];
