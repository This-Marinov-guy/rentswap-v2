"use client";

import { useState, useRef, FormEvent, useMemo } from "react";
import {
  CITIES,
  PROPERTY_TYPES,
  FURNISHED_TYPES,
  AMENITIES_LIST,
  SHARED_SPACE_LIST,
  getTranslatedEnum,
} from "@/utils/defines";
import { resizeImage } from "@/utils/imageResizer";
import DatePicker from "./DatePicker";
import styles from "./RoomListingForm.module.css";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const t = (key: string) => key;

interface RoomListingFormData {
  city: string;
  address: string;
  size: string;
  rent: string;
  registration: boolean;
  bills: string;
  flatmates: string;
  period: string;
  description: string;
  images: File[];
  postcode: string;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  type: number;
  furnishedType: number;
  bathrooms: number;
  toilets: number;
  availableFrom: string;
  availableTo: string;
  amenities: number[];
  sharedSpace: number[];
  note: string;
  referralCode: string;
  termsContact: boolean;
  termsLegals: boolean;
}

interface PersonalData {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

interface RoomListingFormProps {
  personalData?: PersonalData;
  onValidatePersonalData?: () => boolean;
}

export default function RoomListingForm({ personalData, onValidatePersonalData }: RoomListingFormProps = {}) {
  const [formData, setFormData] = useState<RoomListingFormData>({
    city: "",
    address: "",
    size: "",
    rent: "",
    bills: "",
    flatmates: "",
    period: "",
    description: "",
    images: [],
    postcode: "",
    registration: true,
    pets_allowed: false,
    smoking_allowed: false,
    type: 1,
    furnishedType: 1,
    bathrooms: 1,
    toilets: 1,
    availableFrom: "",
    availableTo: "",
    amenities: [],
    sharedSpace: [],
    note: "",
    referralCode: "",
    termsContact: false,
    termsLegals: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RoomListingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const propertyTypeOptions = useMemo(
    () =>
      PROPERTY_TYPES.map(({ value, text }) => ({
        value,
        text: getTranslatedEnum(t, `property.type.${value}`, text),
      })),
    []
  );
  const furnishedTypeOptions = useMemo(
    () =>
      FURNISHED_TYPES.map(({ value, text }) => ({
        value,
        text: getTranslatedEnum(t, `property.furnished_type.${value}`, text),
      })),
    []
  );
  const amenitiesOptions = useMemo(
    () =>
      [...AMENITIES_LIST].map((label, id) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label)),
    []
  );
  const sharedSpaceOptions = useMemo(
    () => SHARED_SPACE_LIST.map((label, id) => ({ id, label })),
    []
  );

  const toggleAmenity = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((x) => x !== id).sort((a, b) => a - b)
        : [...prev.amenities, id].sort((a, b) => a - b),
    }));
  };
  const toggleSharedSpace = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      sharedSpace: prev.sharedSpace.includes(id)
        ? prev.sharedSpace.filter((x) => x !== id).sort((a, b) => a - b)
        : [...prev.sharedSpace, id].sort((a, b) => a - b),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numKeys: (keyof RoomListingFormData)[] = ["type", "furnishedType", "bathrooms", "toilets"];
    const nextValue = numKeys.includes(name as keyof RoomListingFormData)
      ? (name === "bathrooms" || name === "toilets"
        ? Math.max(1, Math.floor(Number(value)) || 1)
        : Number(value) || 1)
      : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
    if (errors[name as keyof RoomListingFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof RoomListingFormData];
        return newErrors;
      });
    }
  };

  const handleToggle = (field: "registration" | "pets_allowed" | "smoking_allowed") => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleImagePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      await handleImageFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleImageFiles(files);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleImageFiles(Array.from(files));
    }
  };

  const handleImageFiles = async (files: File[]) => {
    // Validate file count
    const totalFiles = formData.images.length + files.length;
    if (totalFiles > 10) {
      toast.error(`Maximum 10 images allowed. Currently: ${formData.images.length}, trying to add: ${files.length}`);
      return;
    }

    setIsResizing(true);

    try {
      const processedFiles: File[] = [];

      for (const file of files) {
        // Validate file type
        const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"];
        const validVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/webm"];
        const isValidType = validImageTypes.includes(file.type) || validVideoTypes.includes(file.type);

        if (!isValidType) {
          toast.error(`Invalid file type: ${file.name}. Allowed: jpg, png, jpeg, webp, heic, heif, and video types`);
          continue;
        }

        // Validate file size (4MB = 4 * 1024 * 1024 bytes)
        const maxSize = 4 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error(`File ${file.name} is too large. Maximum size: 4MB`);
          continue;
        }

        // Resize images (not videos)
        if (validImageTypes.includes(file.type)) {
          try {
            const resizedFile = await resizeImage(file, 800, 800, 0.9);
            processedFiles.push(resizedFile);
          } catch (error) {
            console.error(`Error resizing ${file.name}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Error processing ${file.name}: ${errorMessage}`);
          }
        } else {
          // Videos are added as-is (no resizing)
          processedFiles.push(file);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...processedFiles],
      }));

      toast.success(`Added ${processedFiles.length} file(s)`);
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images");
    } finally {
      setIsResizing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RoomListingFormData, string>> = {};

    // Required fields marked with *
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.postcode.trim()) newErrors.postcode = "Postcode is required";
    if (!formData.size.trim()) newErrors.size = "Size is required";
    if (!formData.rent.trim()) newErrors.rent = "Rent is required";
    if (!formData.bills.trim()) newErrors.bills = "Bills is required";
    if (!formData.flatmates.trim()) newErrors.flatmates = "Flatmates is required";
    if (!formData.period.trim()) newErrors.period = "Period is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    // Images validation
    if (formData.images.length < 3) newErrors.images = "At least 3 images are required";
    if (formData.images.length > 10) newErrors.images = "Maximum 10 images allowed";
    if (!formData.termsLegals) newErrors.termsLegals = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Prevent double submission
    if (isSubmitting || isResizing) {
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Validate personal data if validation function is provided
    if (onValidatePersonalData) {
      const isPersonalDataValid = onValidatePersonalData();
      if (!isPersonalDataValid) {
        toast.error("Please fix the errors in the Basic Information section first.");
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Validate personal data
      if (!personalData || !personalData.name || !personalData.surname || !personalData.email || !personalData.phone) {
        toast.error("Personal information is required. Please fill in the Basic Information section first.");
        setIsSubmitting(false);
        return;
      }

      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append("name", personalData.name);
      submitData.append("surname", personalData.surname);
      submitData.append("email", personalData.email);
      submitData.append("phone", personalData.phone);
      submitData.append("city", formData.city);
      submitData.append("address", formData.address);
      submitData.append("size", formData.size);
      submitData.append("rent", formData.rent);
      submitData.append("registration", formData.registration ? "true" : "false");
      submitData.append("postcode", formData.postcode);
      submitData.append("pets_allowed", formData.pets_allowed ? "true" : "false");
      submitData.append("smoking_allowed", formData.smoking_allowed ? "true" : "false");

      submitData.append("type", String(formData.type));
      submitData.append("furnished_type", String(formData.furnishedType));
      submitData.append("bathrooms", String(formData.bathrooms));
      submitData.append("toilets", String(formData.toilets));
      if (formData.availableFrom) submitData.append("available_from", formData.availableFrom);
      if (formData.availableTo) submitData.append("available_to", formData.availableTo);
      formData.amenities.forEach((id) => submitData.append("amenities[]", String(id)));
      formData.sharedSpace.forEach((id) => submitData.append("shared_space[]", String(id)));
      if (formData.note.trim()) submitData.append("note", formData.note);
      if (formData.referralCode.trim()) submitData.append("referral_code", formData.referralCode);
      submitData.append("terms_contact", formData.termsContact ? "true" : "false");
      submitData.append("terms_legals", formData.termsLegals ? "true" : "false");

      if (formData.bills.trim()) submitData.append("bills", formData.bills);
      if (formData.flatmates.trim()) submitData.append("flatmates", formData.flatmates);
      if (formData.period.trim()) submitData.append("period", formData.period);
      if (formData.description.trim()) submitData.append("description", formData.description);

      // Add images
      formData.images.forEach((image) => {
        submitData.append(`images`, image);
      });

      const response = await fetch("/api/submit-room-listing", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        const errorMessage = result.message || result.error || "Failed to submit listing";
        throw new Error(errorMessage);
      }

      toast.success(result.message || "Room listing submitted successfully!");

      // Trigger confetti from submit button
      if (submitButtonRef.current) {
        const rect = submitButtonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x, y },
          colors: ['#fa3c4c', '#1d3557', '#f9f9f9', '#ffd700'],
        });

        // Additional burst after a short delay
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x, y },
            colors: ['#fa3c4c', '#1d3557', '#f9f9f9', '#ffd700'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x, y },
            colors: ['#fa3c4c', '#1d3557', '#f9f9f9', '#ffd700'],
          });
        }, 250);
      }

      // Reset form
      setFormData({
        city: "",
        address: "",
        size: "",
        rent: "",
        registration: false,
        bills: "",
        flatmates: "",
        period: "",
        description: "",
        images: [],
        postcode: "",
        pets_allowed: false,
        smoking_allowed: false,
        type: 1,
        furnishedType: 1,
        bathrooms: 1,
        toilets: 1,
        availableFrom: "",
        availableTo: "",
        amenities: [],
        sharedSpace: [],
        note: "",
        referralCode: "",
        termsContact: false,
        termsLegals: false,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit listing. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="type" className={styles.label}>Property type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.select}`}
                >
                  {propertyTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.text}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>
                  City <span className={styles.required}>*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.select} ${errors.city ? styles.inputError : ""}`}
                >
                  <option value="">Select a city</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <span className={styles.error}>{errors.city}</span>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="furnishedType" className={styles.label}>Furnished</label>
                <select
                  id="furnishedType"
                  name="furnishedType"
                  value={formData.furnishedType}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.select}`}
                >
                  {furnishedTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.text}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address and Postcode Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>
                  Address <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.address ? styles.inputError : ""
                    }`}
                  placeholder="e.g., Randweg 118A"
                />
                <small className={styles.hint}>Precise address will not be shared to the public</small>
                {errors.address && (
                  <span className={styles.error}>{errors.address}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="postcode" className={styles.label}>
                  Postcode <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.postcode ? styles.inputError : ""}`}
                  placeholder="e.g., 1234 AB"
                />
                <small className={styles.hint}>Postcode will not be shared to the public</small>
                {errors.postcode && (
                  <span className={styles.error}>{errors.postcode}</span>
                )}
              </div>
            </div>

            {/* Size and Rent Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="size" className={styles.label}>
                  Size <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.size ? styles.inputError : ""
                    }`}
                  placeholder="e.g., 70"
                />
                {errors.size && (
                  <span className={styles.error}>{errors.size}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rent" className={styles.label}>
                  Rent (€) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  id="rent"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.rent ? styles.inputError : ""
                    }`}
                  placeholder="e.g., 1800"
                  min="0"
                />
                {errors.rent && (
                  <span className={styles.error}>{errors.rent}</span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="bathrooms" className={styles.label}>Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  min={1}
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="toilets" className={styles.label}>Toilets</label>
                <input
                  type="number"
                  id="toilets"
                  name="toilets"
                  min={1}
                  value={formData.toilets}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.switchesRow}>
              <div className={styles.switchItem}>
                <label htmlFor="registration-switch" className={styles.switchLabel}>
                  Registration required
                </label>
                <div className={styles.switchControl}>
                  <input
                    type="checkbox"
                    id="registration-switch"
                    role="switch"
                    checked={formData.registration}
                    onChange={() => handleToggle("registration")}
                    className={styles.switchInput}
                  />
                  <span className={styles.switchStatus}>
                    {formData.registration ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className={styles.switchItem}>
                <label htmlFor="pets-allowed-switch" className={styles.switchLabel}>
                  Pets allowed
                </label>
                <div className={styles.switchControl}>
                  <input
                    type="checkbox"
                    id="pets-allowed-switch"
                    role="switch"
                    checked={formData.pets_allowed}
                    onChange={() => handleToggle("pets_allowed")}
                    className={styles.switchInput}
                  />
                  <span className={styles.switchStatus}>
                    {formData.pets_allowed ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className={styles.switchItem}>
                <label htmlFor="smoking-allowed-switch" className={styles.switchLabel}>
                  Smoking allowed
                </label>
                <div className={styles.switchControl}>
                  <input
                    type="checkbox"
                    id="smoking-allowed-switch"
                    role="switch"
                    checked={formData.smoking_allowed}
                    onChange={() => handleToggle("smoking_allowed")}
                    className={styles.switchInput}
                  />
                  <span className={styles.switchStatus}>
                    {formData.smoking_allowed ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <DatePicker
                  id="availableFrom"
                  name="availableFrom"
                  label="Available from"
                  value={formData.availableFrom}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, availableFrom: value }))
                  }
                  placeholder="Select start date"
                />
              </div>
              <div className={styles.formGroup}>
                <DatePicker
                  id="availableTo"
                  name="availableTo"
                  label="Available to"
                  value={formData.availableTo}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, availableTo: value }))
                  }
                  placeholder="Select end date"
                  minDate={
                    formData.availableFrom
                      ? new Date(formData.availableFrom + "T12:00:00")
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Bills */}
            <div className={styles.formGroup}>
              <label htmlFor="bills" className={styles.label}>
                Bills <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="bills"
                name="bills"
                value={formData.bills}
                onChange={handleChange}
                className={`${styles.input} ${errors.bills ? styles.inputError : ""
                  }`}
                placeholder="e.g., All included"
              />
              {errors.bills && (
                <span className={styles.error}>{errors.bills}</span>
              )}
            </div>

            {/* Flatmates */}
            <div className={styles.formGroup}>
              <label htmlFor="flatmates" className={styles.label}>
                Flatmates <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="flatmates"
                name="flatmates"
                value={formData.flatmates}
                onChange={handleChange}
                className={`${styles.input} ${errors.flatmates ? styles.inputError : ""
                  }`}
                placeholder="e.g., 2"
              />
              {errors.flatmates && (
                <span className={styles.error}>{errors.flatmates}</span>
              )}
            </div>

            <div className={`${styles.formGroup} ${errors.amenities ? styles.checkboxGroupError : ""}`}>
              <label className={styles.label}>Amenities</label>
              <small className={styles.hint}>Select all that apply</small>
              <div className={styles.checkboxGrid}>
                {amenitiesOptions.map(({ id, label }) => (
                  <label key={id} className={styles.checkboxCard}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(id)}
                      onChange={() => toggleAmenity(id)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxCardLabel}>{label}</span>
                  </label>
                ))}
              </div>
              {errors.amenities && <span className={styles.error}>{errors.amenities}</span>}
            </div>

            <div className={`${styles.formGroup} ${errors.sharedSpace ? styles.checkboxGroupError : ""}`}>
              <label className={styles.label}>Shared space</label>
              <small className={styles.hint}>Select all that apply</small>
              <div className={styles.checkboxGrid}>
                {sharedSpaceOptions.map(({ id, label }) => (
                  <label key={id} className={styles.checkboxCard}>
                    <input
                      type="checkbox"
                      checked={formData.sharedSpace.includes(id)}
                      onChange={() => toggleSharedSpace(id)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxCardLabel}>{label}</span>
                  </label>
                ))}
              </div>
              {errors.sharedSpace && <span className={styles.error}>{errors.sharedSpace}</span>}
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${styles.input} ${errors.description ? styles.inputError : ""
                  }`}
                placeholder="e.g., Spacious living room and fully furnished"
              />
              <small className={styles.hint}>Describe the property</small>
              {errors.description && (
                <span className={styles.error}>{errors.description}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="referralCode" className={styles.label}>Referral code</label>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="note" className={styles.label}>Note</label>
              <textarea
                id="note"
                name="note"
                rows={2}
                value={formData.note}
                onChange={handleChange}
                className={styles.input}
                placeholder="Optional note"
              />
            </div>

            <h3 className={styles.subsectionTitle}>Property images</h3>
            <small className={styles.hint}>* Min 3, max 10. JPG, PNG, WebP, HEIC, or video.</small>

            {/* Images */}
            <div className={styles.formGroup}>
              <label htmlFor="images" className={styles.label}>
                Images <span className={styles.required}>*</span>
              </label>
              <div
                ref={dropZoneRef}
                className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ""
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onPaste={handleImagePaste}
                tabIndex={0}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
                <div className={styles.dropZoneContent}>
                  <p className={styles.dropZoneText}>
                    Drag and drop images/videos here, or click to browse
                  </p>
                  <p className={styles.dropZoneSubtext}>
                    You can also paste images from clipboard
                  </p>
                </div>
              </div>
              <ul
                className={styles.fileDescription}
                style={{ fontSize: "0.8rem" }}
              >
                <li>
                  Allowed formats: JPG, PNG, JPEG, WebP, HEIC, HEIF, and video
                  types (MP4, MPEG, QuickTime, AVI, WebM)
                </li>
                <li>Max size: 4MB per file</li>
                <li>Min: 3 images, Max: 10 images</li>
                <li>Images will be automatically resized to 800x800px</li>
              </ul>
              {errors.images && (
                <span className={styles.error}>{errors.images}</span>
              )}

              {/* Display selected images */}
              {formData.images.length > 0 && (
                <div className={styles.imagePreview}>
                  {formData.images.map((image, index) => (
                    <div key={index} className={styles.imagePreviewItem}>
                      <span className={styles.imageName}>{image.name}</span>
                      <span className={styles.imageSize}>
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={styles.removeImageButton}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <p className={styles.imageCount}>
                    {formData.images.length} / 10 images
                  </p>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.termsRow}>
                <input
                  type="checkbox"
                  checked={formData.termsContact}
                  onChange={(e) => setFormData((prev) => ({ ...prev, termsContact: e.target.checked }))}
                  className={styles.checkboxInput}
                />
                <span>I agree to be contacted about this listing.</span>
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.termsRow}>
                <input
                  type="checkbox"
                  checked={formData.termsLegals}
                  onChange={(e) => setFormData((prev) => ({ ...prev, termsLegals: e.target.checked }))}
                  className={styles.checkboxInput}
                />
                <span>
                  I accept the{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>
                    terms and policy
                  </a>
                  . <span className={styles.required}>*</span>
                </span>
              </label>
              {errors.termsLegals && <span className={styles.error}>{errors.termsLegals}</span>}
            </div>

            {/* Submit Button */}
            <div className={styles.formActions}>
              <button
                ref={submitButtonRef}
                type="button"
                onClick={handleSubmit}
                className={styles.submitButton}
                disabled={isSubmitting || isResizing}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isResizing
                    ? "Processing images..."
                    : "Submit Listing"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

