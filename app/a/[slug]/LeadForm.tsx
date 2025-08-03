'use client';

import { useState } from 'react';

interface LeadFormProps {
  propertyId: string;
}

export default function LeadForm({ propertyId }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          propertyId,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Error submitting form. Please try again.');
      }
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="heading-md text-green-600 mb-3">
          Thank You!
        </h2>
        <p className="text-body text-muted mb-6">
          Your information has been submitted successfully. You'll receive updates about this property via email.
        </p>
        <div className="alert alert-success">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Check your email for property details and next steps
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input"
          placeholder="Enter your email"
        />
        <div className="form-help">
          We'll send property updates and details to this email
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Phone Number <span className="text-muted">(Optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="input"
          placeholder="Enter your phone number"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary btn-base w-full"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <div className="loading-spinner mr-2"></div>
            Submitting...
          </span>
        ) : (
          'Submit Interest'
        )}
      </button>
    </form>
  );
}