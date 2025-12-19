"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import styles from "@/app/sign-up/page.module.css";
import RoomListingForm from "./RoomListingForm";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { COUNTRIES, CITIES } from "@/utils/defines";
import toast from "react-hot-toast";
import ToastProvider from "./common/ToastProvider";

type UserType = "looking" | "leaving" | "";

interface FormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
  // Fields for "looking for a room"
  city: string;
  budget: string;
  moveInDate: string;
  periodOfStay: string;
  registrationRequired: string;
  accommodationType: string;
  peopleToAccommodate: string;
  coverLetter: File | null;
  referralCode: string;
  noteToAgent: string;
  permissionToContact: boolean;
  termsAccepted: boolean;
  // Fields for "leaving my room"
  roomLocation: string;
  roomPrice: string;
  availableFrom: string;
  roomType: string;
  roomDescription: string;
}

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    countryCode: "+31",
    password: "",
    confirmPassword: "",
    userType: "",
    // Looking for a room fields
    city: "",
    budget: "",
    moveInDate: "",
    periodOfStay: "",
    registrationRequired: "",
    accommodationType: "Any",
    peopleToAccommodate: "1",
    coverLetter: null,
    referralCode: "",
    noteToAgent: "",
    permissionToContact: false,
    termsAccepted: false,
    // Leaving my room fields
    roomLocation: "",
    roomPrice: "",
    availableFrom: "",
    roomType: "",
    roomDescription: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);

  // Country dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Date picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const selectedDate = formData.moveInDate
    ? new Date(formData.moveInDate)
    : undefined;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
        setCountrySearchQuery("");
      }
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter countries based on search query
  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      country.dialCode.includes(countrySearchQuery) ||
      country.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const selectedCountry =
    COUNTRIES.find((c) => c.dialCode === formData.countryCode) || COUNTRIES[0];

  // Set userType from URL query parameter
  // This is a valid use of useEffect to sync React state with external URL state
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "looking" || typeParam === "leaving") {
      // Only update if different to avoid unnecessary renders
      setFormData((prev) => {
        if (prev.userType === typeParam) {
          return prev; // No change needed
        }
        return { ...prev, userType: typeParam };
      });
    }
    // eslint-disable-next-line react-compiler/react-compiler
  }, [searchParams]); // Sync with URL query parameter changes

  // Check if form is filled
  useEffect(() => {
    const filled =
      formData.name.trim() !== "" &&
      formData.surname.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.userType !== "" &&
      ((formData.userType === "looking" &&
        formData.city.trim() !== "" &&
        formData.budget !== "" &&
        formData.moveInDate !== "" &&
        formData.periodOfStay !== "" &&
        formData.registrationRequired !== "") ||
        (formData.userType === "leaving" &&
          formData.roomLocation.trim() !== "" &&
          formData.roomPrice !== "" &&
          formData.availableFrom !== "" &&
          formData.roomType !== ""));
    setTimeout(() => {
      setIsFormFilled(filled);
    }, 0);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUserTypeChange = (type: UserType) => {
    setFormData((prev) => ({ ...prev, userType: type }));
    
    // Update URL query parameter
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    router.replace(`/sign-up?${params.toString()}`, { scroll: false });
    
    // Clear errors for conditional fields when switching
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.surname;
      delete newErrors.city;
      delete newErrors.budget;
      delete newErrors.moveInDate;
      delete newErrors.periodOfStay;
      delete newErrors.registrationRequired;
      delete newErrors.roomLocation;
      delete newErrors.roomPrice;
      delete newErrors.availableFrom;
      delete newErrors.roomType;
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Basic information validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.surname.trim()) {
      newErrors.surname = "Surname is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone";
    } else if (formData.phone.replace(/\D/g, "").length < 5) {
      newErrors.phone = "Invalid phone";
    }

    // User type validation
    if (!formData.userType) {
      newErrors.userType =
        "Please select whether you're looking for a room or leaving your room";
    }

    // Conditional validation based on user type
    if (formData.userType === "looking") {
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!formData.budget) {
        newErrors.budget = "Budget is required";
      }
      if (!formData.moveInDate) {
        newErrors.moveInDate = "Move-in date is required";
      }
      if (!formData.periodOfStay) {
        newErrors.periodOfStay = "Period of stay is required";
      }
      if (!formData.registrationRequired) {
        newErrors.registrationRequired =
          "Please specify if registration is required";
      }
    } else if (formData.userType === "leaving") {
      if (!formData.roomLocation.trim()) {
        newErrors.roomLocation = "Room location is required";
      }

      if (!formData.roomPrice) {
        newErrors.roomPrice = "Room price is required";
      }

      if (!formData.availableFrom) {
        newErrors.availableFrom = "Available from date is required";
      }

      if (!formData.roomType) {
        newErrors.roomType = "Room type is required";
      }
    }

    setErrors(newErrors);
    
    // Show validation errors as toasts
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => {
        if (error) {
          toast.error(error);
        }
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name as keyof typeof loginErrors]) {
      setLoginErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginErrors({});

    if (!loginData.email.trim()) {
      setLoginErrors({ email: "Email is required" });
      return;
    }

    if (!loginData.password) {
      setLoginErrors({ password: "Password is required" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        setLoginErrors({ general: error.message });
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        router.push("/");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      setLoginErrors({ general: errorMessage });
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/` : "/",
        },
      });

      if (error) {
        console.error("OAuth error:", error.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during OAuth login";
      console.error("OAuth error:", errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show validation errors as toasts
      Object.values(errors).forEach((error) => {
        if (error) {
          toast.error(error);
        }
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Only submit if user type is "looking"
      if (formData.userType !== "looking") {
        toast.error("Please select 'Looking for a room' to submit the form");
        setIsSubmitting(false);
        return;
      }

      // Prepare FormData for API submission
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("surname", formData.surname || "");
      submitFormData.append("email", formData.email);
      submitFormData.append(
        "phone",
        `${formData.countryCode} ${formData.phone}`
      );
      submitFormData.append("type", formData.userType);
      submitFormData.append("city", formData.city);
      submitFormData.append("budget", formData.budget);
      submitFormData.append("move_in", formData.moveInDate);
      submitFormData.append("period", formData.periodOfStay);
      submitFormData.append("registration", formData.registrationRequired);
      submitFormData.append("people", formData.peopleToAccommodate);

      if (formData.coverLetter) {
        submitFormData.append("letter", formData.coverLetter);
      }

      if (formData.referralCode) {
        submitFormData.append("referral_code", formData.referralCode);
      }

      if (formData.noteToAgent) {
        submitFormData.append("note", formData.noteToAgent);
      }

      // Submit to API
      let response: Response;
      try {
        response = await fetch("/api/submit-room-searching", {
          method: "POST",
          body: submitFormData,
        });
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        toast.error("Network error. Please check your connection and try again.");
        setIsSubmitting(false);
        return;
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      let result;
      
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        toast.error(
          `Server error (${response.status}): Please try again or contact support.`
        );
        setIsSubmitting(false);
        return;
      }

      try {
        result = await response.json();
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        toast.error("Invalid response from server. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (!response.ok || !result.success) {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            if (field === "general") {
              toast.error(message as string);
            } else {
              setErrors((prev) => ({ ...prev, [field]: message as string }));
              toast.error(message as string);
            }
          });
        } else {
          toast.error(
            result.message || "Failed to submit form. Please try again."
          );
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      toast.success(
        result.message || "Your information has been submitted successfully!"
      );

      // Reset form
      setFormData({
        name: "",
        surname: "",
        email: "",
        phone: "",
        countryCode: "+31",
        password: "",
        confirmPassword: "",
        userType: "",
        city: "",
        budget: "",
        moveInDate: "",
        periodOfStay: "",
        registrationRequired: "",
        accommodationType: "Any",
        peopleToAccommodate: "1",
        coverLetter: null,
        referralCode: "",
        noteToAgent: "",
        permissionToContact: false,
        termsAccepted: false,
        roomLocation: "",
        roomPrice: "",
        availableFrom: "",
        roomType: "",
        roomDescription: "",
      });
      setErrors({});
      setIsSubmitting(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastProvider />
      <div className={styles.formWrapper}>
        <form
          onSubmit={mode === "login" ? handleLogin : handleSubmit}
          className={`${styles.form} ${styles.formTransition}`}
        >
          {/* Login Form or Basic Information - conditional */}
          {mode === "login" ? (
            <section className={`${styles.section} ${styles.formSlideIn}`}>
              <h2 className={styles.sectionTitle}>Login to Your Account</h2>

              {loginErrors.general && (
                <div className={styles.errorMessage}>{loginErrors.general}</div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="loginEmail" className={styles.label}>
                  Email Address <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className={`${styles.input} ${
                    loginErrors.email ? styles.inputError : ""
                  }`}
                  placeholder="john@example.com"
                />
                {loginErrors.email && (
                  <span className={styles.error}>{loginErrors.email}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="loginPassword" className={styles.label}>
                  Password <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  id="loginPassword"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className={`${styles.input} ${
                    loginErrors.password ? styles.inputError : ""
                  }`}
                  placeholder="Enter your password"
                />
                {loginErrors.password && (
                  <span className={styles.error}>{loginErrors.password}</span>
                )}
              </div>

              <div className={styles.oauthSection}>
                <div className={styles.oauthDivider}>
                  <span>Or continue with</span>
                </div>

                <div className={styles.oauthButtons}>
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin("google")}
                    className={styles.oauthButton}
                    disabled={isSubmitting}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin("facebook")}
                    className={styles.oauthButton}
                    disabled={isSubmitting}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        fill="#1877F2"
                      />
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={`${styles.submitButton} ${styles.loginButton}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <p className={styles.loginText}>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={styles.linkButton}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </section>
          ) : (
            <>
              {(
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Basic Information</h2>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name" className={styles.label}>
                        Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`${styles.input} ${
                          errors.name ? styles.inputError : ""
                        }`}
                        placeholder="John"
                      />
                      {errors.name && (
                        <span className={styles.error}>{errors.name}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="surname" className={styles.label}>
                        Surname <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        className={`${styles.input} ${
                          errors.surname ? styles.inputError : ""
                        }`}
                        placeholder="Doe"
                      />
                      {errors.surname && (
                        <span className={styles.error}>{errors.surname}</span>
                      )}
                    </div>
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
                      className={`${styles.input} ${
                        errors.email ? styles.inputError : ""
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <span className={styles.error}>{errors.email}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      Phone Number <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.phoneInputContainer}>
                      <div
                        ref={countryDropdownRef}
                        className={styles.countryDropdown}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setIsCountryDropdownOpen(!isCountryDropdownOpen)
                          }
                          className={`${styles.countrySelector} ${
                            errors.phone ? styles.inputError : ""
                          }`}
                        >
                          <span className={styles.countryFlag}>
                            {selectedCountry.flag}
                          </span>
                          <span className={styles.countryCode}>
                            {selectedCountry.dialCode}
                          </span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            className={`${styles.dropdownArrow} ${
                              isCountryDropdownOpen
                                ? styles.dropdownArrowOpen
                                : ""
                            }`}
                          >
                            <path
                              d="M2 4L6 8L10 4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {isCountryDropdownOpen && (
                          <>
                            <div
                              className={styles.countryDropdownBackdrop}
                              onClick={() => setIsCountryDropdownOpen(false)}
                            />
                            <div className={styles.countryDropdownMenu}>
                              <div className={styles.countrySearch}>
                                <input
                                  type="text"
                                  placeholder="Search cc"
                                  value={countrySearchQuery}
                                  onChange={(e) =>
                                    setCountrySearchQuery(e.target.value)
                                  }
                                  className={styles.countrySearchInput}
                                  autoFocus
                                />
                              </div>
                              <div className={styles.countryList}>
                                {filteredCountries.map((country) => (
                                  <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        countryCode: country.dialCode,
                                      }));
                                      setIsCountryDropdownOpen(false);
                                      setCountrySearchQuery("");
                                    }}
                                    className={`${styles.countryOption} ${
                                      formData.countryCode === country.dialCode
                                        ? styles.countryOptionSelected
                                        : ""
                                    }`}
                                  >
                                    <span className={styles.countryFlag}>
                                      {country.flag}
                                    </span>
                                    <span className={styles.countryName}>
                                      {country.name}
                                    </span>
                                    <span className={styles.countryDialCode}>
                                      {country.dialCode}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${styles.phoneInput} ${
                          errors.phone ? styles.inputError : ""
                        }`}
                        placeholder="6 12345678"
                      />
                    </div>
                    {errors.phone && (
                      <span className={styles.error}>{errors.phone}</span>
                    )}
                  </div>
                </section>
              )}

              {/* User Type Selection */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>I am...</h2>

                <div className={styles.formGroup}>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="userType"
                        value="looking"
                        checked={(formData.userType as UserType) === "looking"}
                        onChange={() => handleUserTypeChange("looking")}
                        className={styles.radio}
                      />
                      <span className={styles.radioText}>
                        Looking for a room
                      </span>
                    </label>

                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="userType"
                        value="leaving"
                        checked={(formData.userType as UserType) === "leaving"}
                        onChange={() => handleUserTypeChange("leaving")}
                        className={styles.radio}
                      />
                      <span className={styles.radioText}>Leaving my room</span>
                    </label>
                  </div>
                  {errors.userType && (
                    <span className={styles.error}>{errors.userType}</span>
                  )}
                </div>
              </section>

              {/* Conditional Fields - Looking for a Room - extends form */}
              {(formData.userType as UserType) === "looking" && (
                <section
                  className={`${styles.section} ${styles.revealSection} ${styles.formExtend}`}
                >
                  <div className={styles.formGroup}>
                    <label htmlFor="city" className={styles.label}>
                      City <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`${styles.select} ${
                        errors.city ? styles.inputError : ""
                      }`}
                    >
                      <option value="">Select a city</option>
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <span className={styles.error}>{errors.city}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="budget" className={styles.label}>
                      Budget (Amount in EUR){" "}
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={`${styles.input} ${
                        errors.budget ? styles.inputError : ""
                      }`}
                      placeholder="€1200"
                      min="0"
                    />
                    {errors.budget && (
                      <span className={styles.error}>{errors.budget}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="moveInDate" className={styles.label}>
                      Move in date <span className={styles.required}>*</span>
                    </label>
                    <div
                      ref={datePickerRef}
                      className={styles.datePickerWrapper}
                    >
                      <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        className={`${styles.datePickerInput} ${
                          errors.moveInDate ? styles.inputError : ""
                        }`}
                      >
                        {selectedDate
                          ? format(selectedDate, "yyyy-MM-dd")
                          : "Select move-in date"}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className={styles.calendarIcon}
                        >
                          <path
                            d="M12 2.5H4C2.62 2.5 1.5 3.62 1.5 5v7c0 1.38 1.12 2.5 2.5 2.5h8c1.38 0 2.5-1.12 2.5-2.5V5c0-1.38-1.12-2.5-2.5-2.5zM4 4h8c.55 0 1 .45 1 1v1H3V5c0-.55.45-1 1-1zm8 8H4c-.55 0-1-.45-1-1V7.5h10V11c0 .55-.45 1-1 1z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                      {isDatePickerOpen && (
                        <div className={styles.datePickerPopup}>
                          <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              if (date) {
                                setFormData((prev) => ({
                                  ...prev,
                                  moveInDate: format(date, "yyyy-MM-dd"),
                                }));
                                setIsDatePickerOpen(false);
                                if (errors.moveInDate) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    moveInDate: "",
                                  }));
                                }
                              }
                            }}
                            className={styles.dayPicker}
                          />
                        </div>
                      )}
                    </div>
                    {errors.moveInDate && (
                      <span className={styles.error}>{errors.moveInDate}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="periodOfStay" className={styles.label}>
                      Period of stay <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="periodOfStay"
                      name="periodOfStay"
                      value={formData.periodOfStay}
                      onChange={handleChange}
                      className={`${styles.select} ${
                        errors.periodOfStay ? styles.inputError : ""
                      }`}
                    >
                      <option value="">Select period</option>
                      <option value="less than 4 months">
                        less than 4 months
                      </option>
                      <option value="4 months">4 months</option>
                      <option value="6 months">6 months</option>
                      <option value="12 months">12 months</option>
                      <option value="2 years">2 years</option>
                      <option value="3 years">3 years</option>
                      <option value="unlimited">unlimited</option>
                    </select>
                    {errors.periodOfStay && (
                      <span className={styles.error}>
                        {errors.periodOfStay}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Is Registration required{" "}
                      <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="registrationRequired"
                          value="Yes"
                          checked={formData.registrationRequired === "Yes"}
                          onChange={handleChange}
                          className={styles.radio}
                        />
                        <span className={styles.radioText}>Yes</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="registrationRequired"
                          value="No"
                          checked={formData.registrationRequired === "No"}
                          onChange={handleChange}
                          className={styles.radio}
                        />
                        <span className={styles.radioText}>No</span>
                      </label>
                    </div>
                    {errors.registrationRequired && (
                      <span className={styles.error}>
                        {errors.registrationRequired}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="accommodationType" className={styles.label}>
                      Type of accommodation
                    </label>
                    <select
                      id="accommodationType"
                      name="accommodationType"
                      value={formData.accommodationType}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="Any">Any</option>
                      <option value="Shared">Shared</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label
                      htmlFor="peopleToAccommodate"
                      className={styles.label}
                    >
                      People to be accommodated
                    </label>
                    <select
                      id="peopleToAccommodate"
                      name="peopleToAccommodate"
                      value={formData.peopleToAccommodate}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="coverLetter" className={styles.label}>
                      Cover letter that we will send to the landlord/roommate
                    </label>
                    <input
                      type="file"
                      id="coverLetter"
                      name="coverLetter"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          // Validate file size (3MB = 3 * 1024 * 1024 bytes)
                          const maxSize = 3 * 1024 * 1024;
                          if (file.size > maxSize) {
                            setErrors((prev) => ({
                              ...prev,
                              coverLetter: "File size must be less than 3MB",
                            }));
                            e.target.value = ""; // Clear the input
                            setFormData((prev) => ({
                              ...prev,
                              coverLetter: null,
                            }));
                            return;
                          }
                          // Validate file type
                          const allowedTypes = [
                            "application/pdf",
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          ];
                          if (!allowedTypes.includes(file.type)) {
                            setErrors((prev) => ({
                              ...prev,
                              coverLetter: "Only PDF and DOC files are allowed",
                            }));
                            e.target.value = ""; // Clear the input
                            setFormData((prev) => ({
                              ...prev,
                              coverLetter: null,
                            }));
                            return;
                          }
                        }
                        setFormData((prev) => ({ ...prev, coverLetter: file }));
                        if (errors.coverLetter) {
                          setErrors((prev) => ({ ...prev, coverLetter: "" }));
                        }
                      }}
                      className={styles.fileInput}
                    />
                    <p className={styles.fileDescription}>
                      Allowed types: PDF, DOC, DOCX. Max size: 3MB
                    </p>
                    {formData.coverLetter && (
                      <div className={styles.fileName}>
                        {formData.coverLetter.name} (
                        {(formData.coverLetter.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </div>
                    )}
                    {errors.coverLetter && (
                      <span className={styles.error}>{errors.coverLetter}</span>
                    )}
                    <p className={styles.coverLetterTemplate}>
                      You can use our ready-made cover letter template{" "}
                      <a
                        href="/assets/templates/cover_letter_template.pdf"
                        download
                        className={styles.downloadLink}
                      >
                        DOWNLOAD
                      </a>
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="referralCode" className={styles.label}>
                      Referral code{" "}
                      <span className={styles.optional}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="referralCode"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Enter referral code"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="noteToAgent" className={styles.label}>
                      Note to agent{" "}
                      <span className={styles.optional}>(optional)</span>
                    </label>
                    <textarea
                      id="noteToAgent"
                      name="noteToAgent"
                      value={formData.noteToAgent}
                      onChange={handleChange}
                      className={styles.textarea}
                      placeholder="Any additional information you'd like to share..."
                      rows={4}
                    />
                  </div>

                  {/* <div className={styles.domakinLink}>
                    <p>
                      To search properties check{" "}
                      <a
                        href="https://www.domakin.nl/services/renting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.domakinLinkText}
                      >
                        Domakin.nl
                      </a>
                    </p>
                  </div> */}
                </section>
              )}

              {/* Conditional Fields - Leaving My Room - extends form */}
              {(formData.userType as UserType) === "leaving" && (
                <RoomListingForm
                  personalData={{
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    phone: `${formData.countryCode} ${formData.phone}`,
                  }}
                />
              )}

              {/* Actions - show at the end of form */}
              {mode === "signup" &&
                (formData.userType as UserType) === "looking" && (
                  <div className={styles.actions}>
                    <div className={styles.actionContainer}>
                      <button
                        type="submit"
                        className={`${styles.submitButton} ${styles.submitButtonRed}`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                )}
            </>
          )}
        </form>
      </div>
    </>
  );
}
