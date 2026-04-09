import { Platform } from 'react-native';

const API_URL = Platform.OS === 'web' ? '' : (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');

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
