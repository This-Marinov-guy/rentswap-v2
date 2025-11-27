'use client';

import Link from 'next/link';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text' | 'outline' | 'style1' | 'style2';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  href,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'right',
}) => {
  const buttonClassName = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${fullWidth ? styles.fullWidth : ''}
    ${disabled ? styles.disabled : ''}
    ${loading ? styles.loading : ''}
    ${className}
  `.trim();

  const content = (
    <>
      {loading && (
        <span className={styles.loader}>
          <svg className={styles.spinner} viewBox="0 0 24 24">
            <circle
              className={styles.spinnerCircle}
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="3"
            />
          </svg>
        </span>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className={styles.iconLeft}>{icon}</span>
      )}
      <span className={styles.text}>{children}</span>
      {icon && iconPosition === 'right' && !loading && (
        <span className={styles.iconRight}>{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {content}
    </button>
  );
};

export default Button;