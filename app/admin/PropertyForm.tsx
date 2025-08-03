'use client';

import { useState } from 'react';

interface PropertyFormProps {
  onPropertyAdded: () => void;
  isMasterAdmin?: boolean;
}

export default function PropertyForm({ onPropertyAdded, isMasterAdmin = false }: PropertyFormProps) {
  const [address, setAddress] = useState('');
  const [prizeTitle, setPrizeTitle] = useState('');
  const [prizeDescription, setPrizeDescription] = useState('');
  const [prizeImage, setPrizeImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('address', address.trim());
      formData.append('prizeTitle', prizeTitle.trim());
      formData.append('prizeDescription', prizeDescription.trim());
      formData.append('isMasterAdmin', isMasterAdmin.toString());
      if (prizeImage) {
        formData.append('prizeImage', prizeImage);
      }

      const response = await fetch('/api/admin/properties', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setAddress('');
        setPrizeTitle('');
        setPrizeDescription('');
        setPrizeImage(null);
        onPropertyAdded();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        if (response.status === 503) {
          alert('Database not configured. Please add your Supabase credentials to .env.local and restart the server.');
        } else {
          alert(`Error creating property: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      alert('Error creating property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Property Address
        </label>
        <textarea
          id="address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., 123 Main St, Springfield, IL 62701"
          rows={3}
          className="block w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none min-h-[80px]"
        />
        <p className="text-xs text-gray-500">
          Enter the complete property address as it should appear to visitors
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="prizeTitle" className="block text-sm font-medium text-gray-700">
          Prize Title
        </label>
        <input
          id="prizeTitle"
          type="text"
          value={prizeTitle}
          onChange={(e) => setPrizeTitle(e.target.value)}
          placeholder="e.g., $50 Gift Card, Free Home Inspection"
          className="block w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <p className="text-xs text-gray-500">
          What prize are you offering to visitors?
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="prizeDescription" className="block text-sm font-medium text-gray-700">
          Prize Description (Optional)
        </label>
        <textarea
          id="prizeDescription"
          value={prizeDescription}
          onChange={(e) => setPrizeDescription(e.target.value)}
          placeholder="Additional details about the prize, terms and conditions, etc."
          rows={4}
          className="block w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none min-h-[100px]"
        />
        <p className="text-xs text-gray-500">
          Additional details that will be sent in the prize email
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="prizeImage" className="block text-sm font-medium text-gray-700">
          Prize Image (Optional)
        </label>
        <div className="relative">
          <input
            id="prizeImage"
            type="file"
            accept="image/*"
            onChange={(e) => setPrizeImage(e.target.files?.[0] || null)}
            className="block w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer file:rounded-lg"
          />
          {prizeImage && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {prizeImage.name}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Upload an image of the prize to include in the email
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !address.trim()}
        className="btn btn-primary btn-lg w-full group relative overflow-hidden"
      >
        <span className="relative z-10">
          {isSubmitting ? 'Creating...' : 'Add Property'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-x-0 group-hover:translate-x-full transition-transform duration-300"></div>
      </button>
    </form>
  );
}