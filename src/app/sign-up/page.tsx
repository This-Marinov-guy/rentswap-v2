"use client";

import { useState, FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "./page.module.css";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  currentSituation: string;
  desiredLocation: string;
  budgetMin: string;
  budgetMax: string;
  moveInDate: string;
  householdSize: string;
  additionalInfo: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    currentSituation: "",
    desiredLocation: "",
    budgetMin: "",
    budgetMax: "",
    moveInDate: "",
    householdSize: "1",
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.desiredLocation.trim()) {
      newErrors.desiredLocation = "Desired location is required";
    }

    if (!formData.budgetMin || !formData.budgetMax) {
      newErrors.budgetMin = "Budget range is required";
    } else if (parseInt(formData.budgetMin) > parseInt(formData.budgetMax)) {
      newErrors.budgetMin = "Minimum budget cannot exceed maximum budget";
    }

    if (!formData.moveInDate) {
      newErrors.moveInDate = "Move-in date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      alert("Sign up successful! (This is a demo - no actual registration occurred)");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={"highlight"}>Sign Up</h1>
            <p className={styles.subtitle}>
              Your data is safe and fully protected under GDPR guidelines. Learn more in our{" "}
              <Link href="/privacy-policy" className={styles.link}>
                Privacy Policy
              </Link>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Personal Information */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>

              <div className={styles.formGroup}>
                <label htmlFor="fullName" className={styles.label}>
                  Full Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
                  placeholder="John Doe"
                />
                {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  placeholder="john@example.com"
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Password <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                    placeholder="Min. 8 characters"
                  />
                  {errors.password && <span className={styles.error}>{errors.password}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Confirm Password <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && (
                    <span className={styles.error}>{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone Number <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="+31 6 12345678"
                />
              </div>
            </section>

            {/* Housing Preferences */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Housing Preferences</h2>

              <div className={styles.formGroup}>
                <label htmlFor="currentSituation" className={styles.label}>
                  Current Housing Situation <span className={styles.optional}>(Optional)</span>
                </label>
                <select
                  id="currentSituation"
                  name="currentSituation"
                  value={formData.currentSituation}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select your situation</option>
                  <option value="living-with-parents">Living with parents</option>
                  <option value="renting">Currently renting</option>
                  <option value="student-housing">Student housing</option>
                  <option value="temporary-housing">Temporary housing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="desiredLocation" className={styles.label}>
                  Desired Location <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="desiredLocation"
                  name="desiredLocation"
                  value={formData.desiredLocation}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.desiredLocation ? styles.inputError : ""}`}
                  placeholder="e.g., Amsterdam, Rotterdam"
                />
                {errors.desiredLocation && (
                  <span className={styles.error}>{errors.desiredLocation}</span>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="budgetMin" className={styles.label}>
                    Budget (Min) <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="budgetMin"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.budgetMin ? styles.inputError : ""}`}
                    placeholder="€800"
                    min="0"
                  />
                  {errors.budgetMin && <span className={styles.error}>{errors.budgetMin}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="budgetMax" className={styles.label}>
                    Budget (Max) <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="budgetMax"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.budgetMax ? styles.inputError : ""}`}
                    placeholder="€1500"
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="moveInDate" className={styles.label}>
                    Preferred Move-in Date <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    id="moveInDate"
                    name="moveInDate"
                    value={formData.moveInDate}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.moveInDate ? styles.inputError : ""}`}
                  />
                  {errors.moveInDate && <span className={styles.error}>{errors.moveInDate}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="householdSize" className={styles.label}>
                    Household Size
                  </label>
                  <select
                    id="householdSize"
                    name="householdSize"
                    value={formData.householdSize}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3">3 people</option>
                    <option value="4">4+ people</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="additionalInfo" className={styles.label}>
                  Additional Information <span className={styles.optional}>(Optional)</span>
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Tell us more about your housing needs, preferences, or any special requirements..."
                  rows={4}
                />
              </div>
            </section>

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
              <p className={styles.loginText}>
                Already have an account?{" "}
                <Link href="/login" className={styles.link}>
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
