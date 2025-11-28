import React from 'react';
import styles from './Highlight.module.css';

interface HighlightProps {
  children: React.ReactNode;
  variant?: 'style1' | 'style2';
  size?: 'normal' | 'small' | 'large';
  className?: string;
}

const Highlight: React.FC<HighlightProps> = ({
  children,
  variant = 'style1',
  size = 'normal',
  className = '',
}) => {
  const sizeClass =
    size === 'large' ? styles.large : size === 'small' ? styles.small : '';

  const highlightClasses = `
    ${styles.highlight}
    ${sizeClass}
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


