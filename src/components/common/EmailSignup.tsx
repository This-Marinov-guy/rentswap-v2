'use client';

import { useState } from 'react';
import Button from './Button';
import styles from './EmailSignup.module.css';

interface EmailSignupProps {
  placeholder?: string;
  buttonText?: string;
  size?: 'small' | 'medium' | 'large';
  onSubmit?: (email: string) => void;
  className?: string;
}

const EmailSignup: React.FC<EmailSignupProps> = ({
  placeholder = 'Enter your email',
  buttonText = 'Get Started',
  size = 'large',
  onSubmit,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(email);
      }
      
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`${styles.form} ${styles[size]} ${className}`} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder={placeholder}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="primary"
          size={size === 'large' ? 'large' : 'medium'}
          loading={loading}
          className={styles.button}
        >
          {buttonText}
        </Button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {success && (
        <p className={styles.success}>
          🎉 Success! Check your email for next steps.
        </p>
      )}
    </form>
  );
};

export default EmailSignup;