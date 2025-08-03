'use client';

import { useState } from 'react';

interface UpgradeButtonProps {
  userId: string;
  propertyId: string;
}

export default function UpgradeButton({ userId, propertyId }: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (planType: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          propertyId,
          planType,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session');
      }
    } catch (error) {
      alert('Error creating checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleUpgrade('single')}
        disabled={isLoading}
        className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Upgrade for $19/month'}
      </button>
      <button
        onClick={() => handleUpgrade('multi')}
        disabled={isLoading}
        className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : '5 Properties for $59/month'}
      </button>
    </div>
  );
}