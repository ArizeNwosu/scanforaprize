'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  properties: {
    id: string;
    address: string;
    slug: string;
    prize_title: string | null;
  };
}

interface LeadsListProps {
  properties: Array<{
    id: string;
    slug: string;
    address: string;
    prizeTitle: string | null;
  }>;
}

export default function LeadsList({ properties }: LeadsListProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedProperty !== 'all') {
        params.append('propertyId', selectedProperty);
      }
      params.append('limit', '100'); // Show more leads

      const response = await fetch(`/api/admin/leads?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
        setTotalCount(data.totalCount);
      } else if (response.status === 503) {
        console.log('Database not configured');
        setLeads([]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportLeads = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: selectedProperty !== 'all' ? selectedProperty : null,
          format: 'csv'
        }),
      });

      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error exporting leads');
      }
    } catch (error) {
      alert('Error exporting leads');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedProperty]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return 'Not provided';
    // Simple phone formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="glass rounded-2xl shadow-soft overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Collected Leads ({totalCount})
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              View and manage all leads from your QR code campaigns
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="block w-full sm:w-auto min-w-[200px] px-4 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="all">All Properties</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.address.length > 50 
                    ? property.address.substring(0, 47) + '...' 
                    : property.address}
                </option>
              ))}
            </select>
            
            <button
              onClick={exportLeads}
              disabled={isExporting || leads.length === 0}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
            >
              <span className="mr-2">📊</span>
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Loading leads...</h3>
          <p className="text-gray-500">Please wait while we fetch your lead data</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="p-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6">
            <span className="text-3xl animate-bounce-gentle">📧</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">No Leads Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            {selectedProperty === 'all' 
              ? 'Leads will appear here as people scan your QR codes and submit their contact information. Share your QR codes to start collecting leads!'
              : 'No leads found for the selected property. Try selecting "All Properties" or check if your QR codes are being shared properly.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-mobile">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Property Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Prize Offered
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                  <td className="px-6 py-5">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="text-sm font-semibold text-gray-900">
                          {lead.name}
                        </div>
                      </div>
                      <div className="text-sm text-blue-600 hover:text-blue-800">
                        <a href={`mailto:${lead.email}`} className="transition-colors duration-200">
                          {lead.email}
                        </a>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {formatPhone(lead.phone)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900 max-w-xs leading-relaxed">
                        {lead.properties.address}
                      </div>
                      <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md">
                        <span className="text-xs text-gray-600 font-mono">
                          {lead.properties.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {lead.properties.prize_title ? (
                      <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200 shadow-sm">
                        <span className="mr-1">🏆</span>
                        {lead.properties.prize_title}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-medium bg-gray-100 text-gray-500">
                        <span className="mr-1">—</span>
                        No prize offered
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-gray-600 font-medium">
                      {formatDate(lead.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:text-blue-700 transition-all duration-200 group"
                        title="Send Email"
                      >
                        <span className="text-sm group-hover:scale-110 transition-transform duration-200">📧</span>
                      </a>
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 hover:text-green-700 transition-all duration-200 group"
                          title="Call"
                        >
                          <span className="text-sm group-hover:scale-110 transition-transform duration-200">📞</span>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}