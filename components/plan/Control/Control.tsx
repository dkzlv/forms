import React from 'react';
import styles from './Control.module.css';

export function Control({
  help,
  error,
  children,
}: {
  help?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactChild | React.ReactChildren;
}) {
  return (
    <div className={styles.control}>
      {children}
      <div className={styles.root}>
        {help && <p className={styles.help}>{help}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
