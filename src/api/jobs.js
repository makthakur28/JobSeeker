import { Platform } from 'react-native';

const API_URL = 'https://job-scraper-api-production-2b6a.up.railway.app';

export const fetchJobsApi = async (role, location, workType) => {
    try {
        const queryParams = new URLSearchParams({
            role: role,
            location: location,
            work_type: workType
        }).toString();
        
        const res = await fetch(`${API_URL}/api/jobs?${queryParams}`);
        if (!res.ok) throw new Error("Network request failed");
        return await res.json();
    } catch (e) {
        console.error("API Error: ", e);
        throw e;
    }
};
