/**
 * Custom hook for managing rating configuration
 * Fetches the system-wide rating configuration from the backend
 */

import { useState, useEffect } from 'react';
import { ratingConfigApi } from '../utils/apiClient';

const useRatingConfig = () => {
    const [ratingConfig, setRatingConfig] = useState({
        minRating: 1,
        maxRating: 10,
        rangeDescription: '1 to 10'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRatingConfig = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await ratingConfigApi.getConfig();
                setRatingConfig(data);
            } catch (err) {
                console.error('Failed to fetch rating configuration:', err);
                setError(err);
                // Keep default values on error
            } finally {
                setLoading(false);
            }
        };

        fetchRatingConfig();
    }, []);

    return {
        ratingConfig,
        loading,
        error,
        refetch: () => {
            setLoading(true);
            setError(null);
            // Re-fetch logic would go here if needed
        }
    };
};

export default useRatingConfig;
