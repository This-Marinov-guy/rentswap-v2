"use client";

import { useState, useRef, FormEvent } from "react";
import { CITIES } from "@/utils/defines";
import { resizeImage } from "@/utils/imageResizer";
import styles from "./RoomListingForm.module.css";
import toast from "react-hot-toast";
import ToastProvider from "./common/ToastProvider";

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
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RoomListingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
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
            toast.error(`Error processing ${file.name}`);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
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

      // Add JSON fields
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
      <ToastProvider />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.form}>
            {/* City */}
            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>
                City <span className={styles.required}>*</span>
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`${styles.input} ${styles.select} ${
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
                  className={`${styles.input} ${
                    errors.address ? styles.inputError : ""
                  }`}
                  placeholder="e.g., Randweg 118A"
                />
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
                  className={`${styles.input} ${
                    errors.postcode ? styles.inputError : ""
                  }`}
                  placeholder="e.g., 1234 AB"
                />
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
                  className={`${styles.input} ${
                    errors.size ? styles.inputError : ""
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
                  className={`${styles.input} ${
                    errors.rent ? styles.inputError : ""
                  }`}
                  placeholder="e.g., 1800"
                  min="0"
                />
                {errors.rent && (
                  <span className={styles.error}>{errors.rent}</span>
                )}
              </div>
            </div>

            {/* Registration Toggle */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Registration Required</label>
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${
                    formData.registration ? styles.toggleActive : ""
                  }`}
                  onClick={() => handleToggle("registration")}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${
                    !formData.registration ? styles.toggleActive : ""
                  }`}
                  onClick={() => handleToggle("registration")}
                >
                  No
                </button>
              </div>
            </div>

            {/* Pets Allowed Toggle */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Pets Allowed</label>
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${
                    formData.pets_allowed ? styles.toggleActive : ""
                  }`}
                  onClick={() => handleToggle("pets_allowed")}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${
                    !formData.pets_allowed ? styles.toggleActive : ""
                  }`}
                  onClick={() => handleToggle("pets_allowed")}
                >
                  No
                </button>
              </div>
            </div>

            {/* Smoking Allowed Toggle */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Smoking Allowed</label>
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${
                    formData.smoking_allowed ? styles.toggleActive : ""
                  }`}
                  onClick={() => handleToggle("smoking_allowed")}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${
                    !formData.smoking_allowed ? styles.toggleActive : ""
                  }`}
                  onClick={() => handleToggle("smoking_allowed")}
                >
                  No
                </button>
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
                className={`${styles.input} ${
                  errors.bills ? styles.inputError : ""
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
                className={`${styles.input} ${
                  errors.flatmates ? styles.inputError : ""
                }`}
                placeholder="e.g., 2"
              />
              {errors.flatmates && (
                <span className={styles.error}>{errors.flatmates}</span>
              )}
            </div>

            {/* Period */}
            <div className={styles.formGroup}>
              <label htmlFor="period" className={styles.label}>
                Period <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.period ? styles.inputError : ""
                }`}
                placeholder="e.g., July-December"
              />
              {errors.period && (
                <span className={styles.error}>{errors.period}</span>
              )}
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
                className={`${styles.input} ${
                  errors.description ? styles.inputError : ""
                }`}
                placeholder="e.g., Spacious living room and fully furnished"
              />
              {errors.description && (
                <span className={styles.error}>{errors.description}</span>
              )}
            </div>

            {/* Images */}
            <div className={styles.formGroup}>
              <label htmlFor="images" className={styles.label}>
                Images <span className={styles.required}>*</span>
              </label>
              <div
                ref={dropZoneRef}
                className={`${styles.dropZone} ${
                  isDragging ? styles.dropZoneActive : ""
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

            {/* Submit Button */}
            <div className={styles.formActions}>
              <button
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

