import React from 'react';
import styles from './Button.module.css';

export const Button: React.FC<Props> = ({ children, ...props }) => {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};

type Props = JSX.IntrinsicElements['button'];
