"use client"

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Globe, Plus, Activity, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useWebsites } from '@/hooks/useWebsites';
import axios from 'axios';
import { API_BACKEND_URL } from '@/config';
import { useAuth } from '@clerk/nextjs';

type watchmanStatus = "good" | "bad" | "unknown";

function StatusCircle({ status }: { status: watchmanStatus }) {
  return (
    <div className={`w-3 h-3 rounded-full ${status === 'good' ? 'bg-green-400' : status === 'bad' ? 'bg-red-400' : 'bg-gray-500'}`} />
  );
}

function UptimeTicks({ ticks }: { ticks: watchmanStatus[] }) {
  return (
    <div className="flex gap-1 mt-2">
      {ticks.map((tick, index) => (
        <div
          key={`tick-${index}`}
          className={`w-8 h-2 rounded ${tick === 'good' ? 'bg-green-400' : tick === 'bad' ? 'bg-red-400' : 'bg-gray-600'}`}
        />
      ))}
    </div>
  );
}

function CreateWebsiteModal({ isOpen, onClose, onSubmit, isSubmitting }: { 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: (url: string) => void;
  isSubmitting: boolean;
}) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!url) {
      setError('URL is required');
      return;
    }

    try {
      new URL(url);
      setError('');
      onSubmit(url);
    } catch (e) {
      setError('Please enter a valid URL (e.g., https://example.com)');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-purple-800 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Add New Website to Monitor</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
          <input
            type="url"
            className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="https://example.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-md border border-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`px-4 py-2 text-sm font-medium text-white ${isSubmitting ? 'bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} rounded-md shadow-md flex items-center justify-center min-w-24`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              'Add Website'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProcessedWebsite {
  id: string;
  url: string;
  status: watchmanStatus;
  uptimePercentage: number;
  lastChecked: string;
  uptimeTicks: watchmanStatus[];
}

function WebsiteCard({ website }: { website: ProcessedWebsite }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg shadow-md overflow-hidden border border-gray-800 hover:border-purple-800 transition-colors duration-200">
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <StatusCircle status={website.status} />
          <div>
            <h3 className="font-semibold text-white">{website.url}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">
            {website.uptimePercentage.toFixed(1)}% uptime
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-800">
          <div className="mt-3">
            <p className="text-sm text-gray-300 mb-1">Last 30 minutes status:</p>
            <UptimeTicks ticks={website.uptimeTicks} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last checked: {website.lastChecked}
          </p>
        </div>
      )}
    </div>
  );
}

function Notification({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
      type === 'success' ? 'bg-green-900 border border-green-700' : 'bg-red-900 border border-red-700'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-400" />
      )}
      <p className="text-white">{message}</p>
      <button 
        onClick={onClose}
        className="text-gray-300 hover:text-white ml-4"
      >
        ×
      </button>
    </div>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  const {websites, refreshWebsites, loading, error} = useWebsites();
  const { getToken } = useAuth();

  const processedWebsites = useMemo(() => {
    if (!websites || websites.length === 0) return [];
    
    return websites.map(website => {
      const ticks = website.ticks || [];
      const sortedTicks = [...ticks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentTicks = sortedTicks.filter(tick => new Date(tick.createdAt) > thirtyMinutesAgo);
      const windows: watchmanStatus[] = [];

      for (let i = 0; i < 10; i++) {
        const windowStart = new Date(Date.now() - (i + 1) * 3 * 60 * 1000);
        const windowEnd = new Date(Date.now() - i * 3 * 60 * 1000);
        const windowTicks = recentTicks.filter(tick => {
          const tickTime = new Date(tick.createdAt);
          return tickTime >= windowStart && tickTime < windowEnd;
        });
        const upTicks = windowTicks.filter(tick => tick.status === 'Good').length;
        windows[9 - i] = windowTicks.length === 0 ? "unknown" : (upTicks / windowTicks.length) >= 0.5 ? "good" : "bad";
      }

      const totalTicks = sortedTicks.length;
      const upTicks = sortedTicks.filter(tick => tick.status === 'Good').length;
      const uptimePercentage = totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100;
      const currentStatus = windows[windows.length - 1];
      const lastChecked = sortedTicks[0] ? new Date(sortedTicks[0].createdAt).toLocaleTimeString() : 'Never';

      return {
        id: website.id,
        url: website.url,
        status: currentStatus,
        uptimePercentage,
        lastChecked,
        uptimeTicks: windows,
      };
    });
  }, [websites]);

  const handleAddWebsite = async (url: string) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      await axios.post(`${API_BACKEND_URL}/api/v1/website`, { url }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setNotification({ message: `Successfully added ${url} to monitoring`, type: 'success' });
      await refreshWebsites();
    } catch (error) {
      console.error("Failed to add website:", error);
      setNotification({ message: "Failed to add website. Please try again.", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Watchman</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => refreshWebsites()}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Website</span>
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="bg-gray-900 bg-opacity-70 rounded-lg border border-gray-800 p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading websites...</h3>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-50 rounded-lg border border-red-800 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Error loading websites</h3>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={refreshWebsites}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : processedWebsites.length > 0 ? (
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {processedWebsites.map((website) => (
              <WebsiteCard key={`website-${website.id}-${website.url}`} website={website} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 bg-opacity-70 rounded-lg border border-gray-800 p-8 text-center">
            <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No websites yet</h3>
            <p className="text-gray-400 mb-6">Add your first website to start monitoring uptime</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 shadow-md"
            >
              Add Your First Website
            </button>
          </div>
        )}
      </div>

      <CreateWebsiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddWebsite}
        isSubmitting={isSubmitting}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}