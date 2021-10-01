import { Option } from '@plan';
import React, { useCallback, useMemo } from 'react';
import styles from './RadioGroup.module.css';

const RadioGroup: React.FC<Props> = ({ options, onChange, selected }) => {
  const name = useMemo(() => {
    return Math.random().toString();
  }, []);
  const change: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onChange(e.currentTarget.value);
    },
    [onChange]
  );

  return (
    <>
      {options.map(({ value, label }) => (
        <label className={styles.label} key={value}>
          <input
            type='radio'
            value={value}
            name={name}
            checked={value === selected}
            onChange={change}
          />{' '}
          {label}
        </label>
      ))}
    </>
  );
};

type Props = {
  options: Option[];
  selected: string;
  onChange: (newVal: string) => void;
};

export default RadioGroup;
