import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

import SVG from './image.svg';

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <SVG className={styles.featureSvg} />
    </section>
  );
}
