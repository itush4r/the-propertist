'use client';

import { useState } from 'react';
import SuccessToast from './SuccessToast';

interface ScheduleTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
}

interface FormErrors {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
}

export default function ScheduleTourModal({ isOpen, onClose, propertyTitle }: ScheduleTourModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
  });

  // Email validation regex
  const validateEmail = (email: string): string => {
    if (!email.trim()) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
  };

  // Name validation - 3+ letters, spaces only after 3+ letters
  const validateName = (name: string): string => {
    if (!name.trim()) return '';

    // Only allow letters and spaces
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return 'Only letters and spaces are allowed';
    }

    // Get only alphabetic characters (remove spaces)
    const lettersOnly = name.replace(/\s/g, '');

    // Must have at least 3 letters
    if (lettersOnly.length < 3) {
      return 'At least 3 letters required';
    }

    // Space can only appear after 3+ letters
    const firstSpaceIndex = name.indexOf(' ');
    if (firstSpaceIndex !== -1 && firstSpaceIndex < 3) {
      return 'Space only allowed after 3 letters';
    }

    return '';
  };

  // Phone validation - 10 digits OR +91 + 10 digits (13 chars total)
  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return '';

    const digitsOnly = phone.replace(/\D/g, '');
    const hasCountryCode = phone.startsWith('+91');

    // Valid if 10 digits (without country code)
    if (digitsOnly.length === 10 && !hasCountryCode) {
      return '';
    }

    // Valid if +91 followed by 10 digits (13 chars total)
    if (hasCountryCode && digitsOnly.length === 12 && phone.length === 13) {
      return '';
    }

    // Invalid format
    if (hasCountryCode) {
      return 'Phone with country code should be +91 followed by 10 digits (13 characters total)';
    } else {
      return 'Phone number should be 10 digits';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change
    let error = '';
    if (name === 'name') {
      error = validateName(value);
    } else if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'phone') {
      error = validatePhone(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {
      name: !formData.name.trim() ? 'Name is required' : validateName(formData.name),
      email: !formData.email.trim() ? 'Email is required' : validateEmail(formData.email),
      phone: !formData.phone.trim() ? 'Phone number is required' : validatePhone(formData.phone),
      date: !formData.date ? 'Date is required' : '',
      time: !formData.time ? 'Time is required' : '',
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
    });
    setErrors({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
    });

    // Close modal after 2 seconds
    setTimeout(() => {
      onClose();
      setShowSuccess(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-stone-100 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Schedule a Tour</h2>
              <p className="text-sm text-stone-500 mt-1">{propertyTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-stone-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-stone-200 focus:ring-amber-500 focus:border-transparent'
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-stone-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-stone-200 focus:ring-amber-500 focus:border-transparent'
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-stone-900 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-stone-200 focus:ring-amber-500 focus:border-transparent'
                }`}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-stone-900 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.date
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-stone-200 focus:ring-amber-500 focus:border-transparent'
                  }`}
                />
                {errors.date && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-semibold text-stone-900 mb-2">
                  Preferred Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.time
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-stone-200 focus:ring-amber-500 focus:border-transparent'
                  }`}
                />
                {errors.time && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || Object.values(errors).some(err => err !== '')}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors mt-6 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeWidth={2} strokeDasharray="15.7" />
                  </svg>
                  Scheduling...
                </>
              ) : (
                'Schedule Tour'
              )}
            </button>

            <p className="text-xs text-stone-500 text-center mt-4">
              We'll send you a confirmation email shortly.
            </p>
          </form>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <SuccessToast
          title="Tour Scheduled!"
          message="We'll send you a confirmation email shortly."
        />
      )}
    </>
  );
}
