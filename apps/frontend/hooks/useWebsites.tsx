"use client"

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import axios from "axios"; 
import { API_BACKEND_URL } from "@/config";

interface Website {
    id: string;
    url: string;
    ticks: {
        id: string;
        createdAt: string;
        status: string; 
        latency: number;
    }[];
}

interface UseWebsitesReturn {
    websites: Website[];
    refreshWebsites: () => Promise<void>;
    loading: boolean;
    error: string | null;
}

export function useWebsites(): UseWebsitesReturn {
    const { getToken } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshWebsites = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const auth = await getToken();
            if (!auth) throw new Error("No authentication token available");

            const res = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
                headers: { Authorization: `Bearer ${auth}` }
            });
            
            console.log("API Response:", res.data); // ffs pls work
            let websitesData: Website[] = [];
            
            if (Array.isArray(res.data)) {
                websitesData = res.data;
            } else if (res.data?.websites && Array.isArray(res.data.websites)) {
                websitesData = res.data.websites;
            } else if (res.data?.data && Array.isArray(res.data.data)) {
                websitesData = res.data.data;
            } else {
                throw new Error("Invalid response format - expected array of websites");
            }

            setWebsites(websitesData);
        } catch (error) {
            console.error("Failed to fetch websites:", error);
            let errorMessage = "Failed to fetch websites";
            if (axios.isAxiosError(error)) {
                errorMessage += `: ${error.response?.status || 'No status'} - ${error.response?.data?.message || 'No additional info'}`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        refreshWebsites();
        const interval = setInterval(refreshWebsites, 1000 * 60 * 1);
        return () => clearInterval(interval);
    }, [refreshWebsites]);

    return { websites, refreshWebsites, loading, error };
}