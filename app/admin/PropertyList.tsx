'use client';

import { useState } from 'react';

interface Property {
  id: string;
  slug: string;
  address: string;
  verificationCode: string;
  claimedByUserId: string | null;
  createdAt: Date;
  prizeTitle: string | null;
  prizeDescription: string | null;
  prizeImageUrl: string | null;
  _count: {
    leads: number;
  };
}

interface PropertyListProps {
  properties: Property[];
  onUpdate: () => void;
}

export default function PropertyList({ properties, onUpdate }: PropertyListProps) {
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    address: '',
    prizeTitle: '',
    prizeDescription: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ [key: string]: string }>({});
  const [loadingQr, setLoadingQr] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const startEdit = (property: Property) => {
    setEditingProperty(property.id);
    setEditForm({
      address: property.address,
      prizeTitle: property.prizeTitle || '',
      prizeDescription: property.prizeDescription || '',
    });
  };

  const cancelEdit = () => {
    setEditingProperty(null);
    setEditForm({ address: '', prizeTitle: '', prizeDescription: '' });
  };

  const saveEdit = async (propertyId: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setEditingProperty(null);
        setEditForm({ address: '', prizeTitle: '', prizeDescription: '' });
        onUpdate();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Error updating property: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error updating property');
    } finally {
      setIsUpdating(false);
    }
  };

  const generateQrCode = async (property: Property) => {
    setLoadingQr(property.id);
    try {
      const response = await fetch(`/api/admin/qrcode/${property.slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size: 300 }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeData(prev => ({
          ...prev,
          [property.id]: data.dataUrl
        }));
      } else {
        alert('Error generating QR code');
      }
    } catch (error) {
      alert('Error generating QR code');
    } finally {
      setLoadingQr(null);
    }
  };

  const downloadQrCode = async (property: Property, format: 'png' | 'svg' = 'png', size: number = 600) => {
    try {
      const response = await fetch(`/api/admin/qrcode/${property.slug}?format=${format}&size=${size}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-code-${property.slug}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error downloading QR code');
      }
    } catch (error) {
      alert('Error downloading QR code');
    }
  };

  const generateSlipContent = (property: Property) => {
    return `🏠 Agent Lead Access Code

A QR code has been placed on your yard sign as part of a lead capture system.

To unlock the leads that have been collected from this QR:

1. Go to: https://scanforaprize.com/claim
2. Enter your property code: ${property.slug}
3. Enter your unlock code: ${property.verificationCode}

Note: Only those with access to this property can unlock these leads.`;
  };

  if (properties.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-6xl mb-4 animate-bounce-gentle">🏠</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">No Properties Yet</h3>
        <p className="text-gray-500">Add your first property to get started with lead collection.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {properties.map((property) => (
        <div key={property.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {property.address}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>{property._count.leads} leads</span>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  property.claimedByUserId 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.claimedByUserId ? 'Claimed' : 'Unclaimed'}
                </span>
                <span>
                  Created {formatDate(property.createdAt)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setExpandedProperty(
                expandedProperty === property.id ? null : property.id
              )}
              className="btn btn-ghost btn-sm text-blue-600 hover:text-blue-800"
            >
              {expandedProperty === property.id ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {expandedProperty === property.id && (
            <div className="mt-6 space-y-6 animate-slide-up">
              {/* Edit Form or Display */}
              {editingProperty === property.id ? (
                <div className="glass p-6 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-4">Edit Property</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="input w-full resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Prize Title</label>
                      <input
                        type="text"
                        value={editForm.prizeTitle}
                        onChange={(e) => setEditForm({ ...editForm, prizeTitle: e.target.value })}
                        className="input w-full"
                        placeholder="e.g., $50 Gift Card"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Prize Description</label>
                      <textarea
                        value={editForm.prizeDescription}
                        onChange={(e) => setEditForm({ ...editForm, prizeDescription: e.target.value })}
                        className="input w-full resize-none"
                        rows={3}
                        placeholder="Additional details about the prize..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => saveEdit(property.id)}
                        disabled={isUpdating}
                        className="btn btn-primary btn-sm"
                      >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isUpdating}
                        className="btn btn-outline btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={() => startEdit(property)}
                    className="btn btn-outline btn-sm"
                  >
                    Edit Property
                  </button>
                </div>
              )}

              {/* Prize Information */}
              {property.prizeTitle && (
                <div className="glass p-6 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <h4 className="font-semibold text-orange-800 mb-4 flex items-center">
                    <span className="mr-2">🏆</span>
                    Prize Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-orange-700">Prize: </span>
                      <span className="text-orange-800">{property.prizeTitle}</span>
                    </div>
                    {property.prizeDescription && (
                      <div>
                        <span className="font-medium text-orange-700">Description: </span>
                        <span className="text-orange-800">{property.prizeDescription}</span>
                      </div>
                    )}
                    {property.prizeImageUrl && (
                      <div>
                        <span className="font-medium text-orange-700">Image: </span>
                        <div className="mt-3">
                          <img 
                            src={property.prizeImageUrl} 
                            alt={property.prizeTitle}
                            className="max-w-full h-32 object-cover rounded-lg border shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-3">QR Code URL</h4>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-white p-3 rounded-lg border flex-1 break-all font-mono">
                      https://scanforaprize.com/a/{property.slug}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`https://scanforaprize.com/a/${property.slug}`)}
                      className="btn btn-primary btn-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-3">Verification Code</h4>
                  <div className="flex items-center space-x-2">
                    <code className="text-lg font-mono bg-white p-3 rounded-lg border flex-1 text-center">
                      {property.verificationCode}
                    </code>
                    <button
                      onClick={() => copyToClipboard(property.verificationCode)}
                      className="btn btn-primary btn-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="glass p-6 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-purple-800 flex items-center">
                    <span className="mr-2">📱</span>
                    QR Code
                  </h4>
                  {!qrCodeData[property.id] && (
                    <button
                      onClick={() => generateQrCode(property)}
                      disabled={loadingQr === property.id}
                      className="btn btn-primary btn-sm"
                    >
                      {loadingQr === property.id ? 'Generating...' : 'Generate QR Code'}
                    </button>
                  )}
                </div>

                {qrCodeData[property.id] && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-white p-6 rounded-xl border shadow-soft">
                        <img 
                          src={qrCodeData[property.id]} 
                          alt={`QR Code for ${property.address}`}
                          className="w-48 h-48"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => downloadQrCode(property, 'png', 300)}
                        className="btn btn-primary btn-sm"
                      >
                        📥 Download PNG (Small)
                      </button>
                      <button
                        onClick={() => downloadQrCode(property, 'png', 600)}
                        className="btn btn-primary btn-sm"
                      >
                        📥 Download PNG (Large)
                      </button>
                      <button
                        onClick={() => downloadQrCode(property, 'svg', 600)}
                        className="btn btn-outline btn-sm"
                      >
                        📥 Download SVG
                      </button>
                      <button
                        onClick={() => generateQrCode(property)}
                        className="btn btn-outline btn-sm"
                      >
                        🔄 Regenerate
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-purple-700">
                        Print this QR code and place it on your yard sign or marketing materials
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="glass p-6 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <h4 className="font-semibold text-gray-700 mb-4">Paper Slip Content</h4>
                <pre className="text-xs bg-white p-4 rounded-lg border whitespace-pre-wrap overflow-x-auto font-mono">
                  {generateSlipContent(property)}
                </pre>
                <button
                  onClick={() => copyToClipboard(generateSlipContent(property))}
                  className="mt-3 btn btn-outline btn-sm"
                >
                  Copy Slip Content
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}