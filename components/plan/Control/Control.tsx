import { ErrorMessage, FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import styles from './Control.module.css';

export function Control<T>({
  children,
  help,
  name,
}: {
  help?: string;
  name: keyof T;
  children: React.ReactChild | React.ReactChildren;
}) {
  return (
    <div className={styles.control}>
      {children}
      <div className={styles.root}>
        {help && <p className={styles.help}>{help}</p>}
        <ErrorMessage component='p' className={styles.error} name={name as string} />
      </div>
    </div>
  );
}
