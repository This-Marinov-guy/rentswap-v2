"use client";

import { useState, useEffect, useRef } from "react";
import RoomListingForm from "@/components/RoomListingForm";
import { COUNTRIES } from "@/utils/defines";
import styles from "./RoommateFinderForm.module.css";

interface PersonalData {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export default function RoommateFinderForm() {
  const [personalData, setPersonalData] = useState<PersonalData>({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });

  const [countryCode, setCountryCode] = useState("+31");
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof PersonalData, boolean>>>({});
  
  // Country dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.dialCode === countryCode) || COUNTRIES[0];
  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      country.dialCode.includes(countrySearchQuery) ||
      country.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
        setCountrySearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof PersonalData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof PersonalData);
  };

  const validateField = (fieldName: keyof PersonalData) => {
    const newErrors: Partial<Record<keyof PersonalData, string>> = { ...errors };

    switch (fieldName) {
      case "name":
        if (!personalData.name.trim()) {
          newErrors.name = "Name is required";
        } else {
          delete newErrors.name;
        }
        break;
      case "surname":
        if (!personalData.surname.trim()) {
          newErrors.surname = "Surname is required";
        } else {
          delete newErrors.surname;
        }
        break;
      case "email":
        if (!personalData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalData.email)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "phone":
        if (!personalData.phone.trim()) {
          newErrors.phone = "Phone is required";
        } else if (!/^[\d\s\-+()]+$/.test(personalData.phone)) {
          newErrors.phone = "Invalid phone";
        } else if (personalData.phone.replace(/\D/g, "").length < 5) {
          newErrors.phone = "Invalid phone";
        } else {
          delete newErrors.phone;
        }
        break;
    }

    setErrors(newErrors);
  };

  const validatePersonalData = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalData, string>> = {};

    if (!personalData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!personalData.surname.trim()) {
      newErrors.surname = "Surname is required";
    }
    if (!personalData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!personalData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[\d\s\-+()]+$/.test(personalData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    } else if (personalData.phone.replace(/\D/g, "").length < 6) {
      newErrors.phone = "Phone number must be at least 6 digits";
    }

    setErrors(newErrors);
    // Mark all fields as touched when validating
    setTouched({
      name: true,
      surname: true,
      email: true,
      phone: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const isPersonalDataValid = 
    personalData.name.trim() !== "" &&
    personalData.surname.trim() !== "" &&
    personalData.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalData.email) &&
    personalData.phone.trim() !== "";

  return (
    <div className={styles.formContainer}>
      {/* Personal Information Form */}
      <section className={styles.personalInfoSection}>
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
              value={personalData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              placeholder="John"
            />
            {touched.name && errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="surname" className={styles.label}>
              Surname <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={personalData.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${errors.surname ? styles.inputError : ""}`}
              placeholder="Doe"
            />
            {touched.surname && errors.surname && <span className={styles.error}>{errors.surname}</span>}
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
            value={personalData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            placeholder="john@example.com"
          />
          {touched.email && errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            Phone Number <span className={styles.required}>*</span>
          </label>
          <div className={`${styles.phoneInputContainer} ${errors.phone ? styles.phoneInputContainerError : ""}`}>
            <div
              ref={countryDropdownRef}
              className={styles.countryDropdown}
            >
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
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
                    isCountryDropdownOpen ? styles.dropdownArrowOpen : ""
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
                        placeholder="Search country"
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
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
                            setCountryCode(country.dialCode);
                            setIsCountryDropdownOpen(false);
                            setCountrySearchQuery("");
                          }}
                          className={`${styles.countryOption} ${
                            countryCode === country.dialCode
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
              value={personalData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.phoneInput} ${
                errors.phone ? styles.inputError : ""
              }`}
              placeholder="6 12345678"
            />
          </div>
          {touched.phone && errors.phone && <span className={styles.error}>{errors.phone}</span>}
        </div>
      </section>

      {/* Room Listing Form */}
      <RoomListingForm
        personalData={{
          name: personalData.name,
          surname: personalData.surname,
          email: personalData.email,
          phone: personalData.phone ? `${countryCode} ${personalData.phone}` : "",
        }}
        onValidatePersonalData={validatePersonalData}
      />
    </div>
  );
}

