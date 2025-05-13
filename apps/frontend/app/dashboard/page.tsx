"use client";
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Globe, Plus, Activity } from 'lucide-react';
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
          key={index}
          className={`w-8 h-2 rounded ${
            tick === 'good' ? 'bg-green-400' : tick === 'bad' ? 'bg-red-400' : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
  );
}

function CreateWebsiteModal({ isOpen, onClose }: { isOpen: boolean; onClose: (url: string | null) => void }) {
  const [url, setUrl] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-purple-800 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Add New Website to Monitor</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              URL
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://siddharth.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => onClose(null)}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-md border border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => onClose(url)}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-md"
            >
              Add Website
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

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {websites, refreshWebsites} = useWebsites();
  const { getToken } = useAuth();

  const processedWebsites = useMemo(() => {
    if (!websites) return [];//fuck errors
    return websites.map(website => {
      const sortedTicks = [...website.ticks].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentTicks = sortedTicks.filter(tick => 
        new Date(tick.createdAt) > thirtyMinutesAgo
      );

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

      const lastChecked = sortedTicks[0]
        ? new Date(sortedTicks[0].createdAt).toLocaleTimeString()
        : 'Never';

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
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Website</span>
            </button>
          </div>
        </div>
        
        {processedWebsites.length > 0 ? (
          <div className="space-y-4">
            {processedWebsites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
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
        onClose={async (url) => {
            if (url === null) {
                setIsModalOpen(false);
                return;
            }

            const token = await getToken();
            setIsModalOpen(false);
            try {
              await axios.post(`${API_BACKEND_URL}/api/v1/website`, {
                  url,
              }, {
                  headers: {
                      Authorization: token,
                  },
              });
              refreshWebsites();
            } catch (error) {
              console.error("Failed to add website:", error);
            }
        }}
      />
    </div>
  );
}

export default App;