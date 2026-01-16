import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  gender: 'MALE' | 'FEMALE';
}

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void;
  isLoading: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'MALE'
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on user input
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Process phone number: add +251 prefix
    let phoneSuffix = formData.phone.replace(/\D/g, '');
    if (phoneSuffix.startsWith('0')) phoneSuffix = phoneSuffix.substring(1);
    const fullPhone = `+251 ${phoneSuffix}`;

    // Pass validated data to parent
    onSubmit({
      fullName: formData.fullName,
      email: formData.email,
      phone: fullPhone,
      password: formData.password,
      gender: formData.gender as 'MALE' | 'FEMALE'
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-brand-700">
          {t('common.full_name')}
        </label>
        <div className="mt-1">
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-brand-300 rounded-md shadow-sm placeholder-brand-400 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-brand-700">
          {t('common.gender')}
        </label>
        <div className="mt-1">
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-brand-300 rounded-md shadow-sm placeholder-brand-400 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm bg-white"
          >
             <option value="MALE">{t('common.male')}</option>
             <option value="FEMALE">{t('common.female')}</option>
          </select>
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-700">
          {t('common.email')}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-brand-300 rounded-md shadow-sm placeholder-brand-400 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-brand-700">
          {t('common.phone')}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-brand-300 bg-brand-50 text-brand-500 sm:text-sm font-medium select-none">
            +251
          </span>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="911 234 567"
            className="flex-1 block w-full px-3 py-2 rounded-none rounded-r-md border border-brand-300 focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-brand-700">
          {t('common.password')}
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-brand-300 rounded-md shadow-sm placeholder-brand-400 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-700">
          {t('common.confirm_password')}
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-brand-300 rounded-md shadow-sm placeholder-brand-400 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 transition"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('common.continue')}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;