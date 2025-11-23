import React from 'react';
import styles from './Highlight.module.css';

interface HighlightProps {
  children: React.ReactNode;
  variant?: 'style1' | 'style2';
  size?: 'normal' | 'large';
  className?: string;
}

const Highlight: React.FC<HighlightProps> = ({
  children,
  variant = 'style1',
  size = 'normal',
  className = '',
}) => {
  const highlightClasses = `
    ${styles.highlight}
    ${size === 'large' ? styles.large : ''}
    ${styles[variant]}
    ${className}
  `.trim();

  return (
    <span className={highlightClasses}>
      {children}
    </span>
  );
};

export default Highlight;
