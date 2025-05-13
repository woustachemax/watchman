"use client"

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios"; 
import { API_BACKEND_URL } from "@/config";

interface Website {
    id: string,
    url: string,
    ticks: {
        id: string,
        createdAt: string,
        status: string, 
        latency: number
    }[]
}

export function useWebsites() {
    const { getToken } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);

    const refreshWebsites = async () => {
        try {
            const auth = await getToken();
            const res = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
                headers: {
                    Authorization: auth
                }
            });
            setWebsites(res.data.websites);
        } catch (error) {
            console.error("Failed to fetch websites:", error);
        }
    };

    useEffect(() => {
        refreshWebsites();

        const interval = setInterval(() => {
            refreshWebsites();
        }, 1000 * 60 * 1); 

        return () => clearInterval(interval);
    }, []);

    return { websites, refreshWebsites };
}