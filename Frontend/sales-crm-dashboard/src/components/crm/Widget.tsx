// src/components/Widget.tsx
import React from 'react';
import styles from '../../styles/crm/widget.module.css'; // Import your widget styles

const Widget: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className={styles.widget}>
      <h3>{title}</h3>
      {/* Add your content here */}
    </div>
  );
};

export default Widget;
