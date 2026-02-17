"use client";

import React from "react";
import DatePickerLib from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";
import styles from "./DatePicker.module.css";

export interface DatePickerProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: React.ReactNode;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

const parseDate = (s: string): Date | null => {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(s + "T12:00:00");
  return isNaN(d.getTime()) ? null : d;
};
const formatForValue = (d: Date) =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");

export default function DatePicker({
  id,
  name,
  value,
  onChange,
  placeholder = "Select date",
  label,
  error,
  minDate,
  maxDate,
  disabled = false,
  className,
  inputClassName,
}: DatePickerProps) {
  const selected = parseDate(value);
  const isInvalid = Boolean(error);

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <DatePickerLib
        id={id}
        name={name}
        selected={selected}
        onChange={(date: Date | null) => {
          if (date) onChange(formatForValue(date));
        }}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        popperClassName={styles.popper}
        calendarClassName={styles.calendar}
        className={`${styles.input} ${isInvalid ? styles.inputError : ""} ${inputClassName ?? ""}`}
        wrapperClassName={styles.inputWrapper}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
