/**
 * Custom hook for handling API calls with loading states and error handling
 * Provides consistent state management for API operations
 */

import { useState, useCallback } from 'react';

/**
 * Custom hook for API calls with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} API call state and functions
 */
export const useApiCall = (apiFunction, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await apiFunction(...args);
            setData(result);
            
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        reset,
        isSuccess: !loading && !error && data !== null,
        isError: !loading && error !== null,
    };
};

/**
 * Custom hook for candidate matching
 * @returns {Object} Candidate matching state and functions
 */
export const useCandidateMatching = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    const matchCandidates = useCallback(async (vacancyDescription) => {
        // Always clear previous state immediately at the start
        setError(null);
        setMatches([]);
        setLoading(true);

        if (!vacancyDescription?.trim()) {
            setError(new Error('Please enter a vacancy description.'));
            setLoading(false);
            return;
        }

        try {
            const { candidateApi } = await import('../utils/apiClient');

            // Try streaming first
            try {
                const response = await candidateApi.streamMatchCandidates(vacancyDescription);
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let buffered = '';
                let collected = [];

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    buffered += decoder.decode(value, { stream: true });

                    let lines = buffered.split('\n');
                    buffered = lines.pop() || '';
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed) continue;
                        try {
                            const obj = JSON.parse(trimmed);
                            if (obj.type === 'done') {
                                // no-op, will finish naturally
                            } else if (obj.type === 'error') {
                                setError(new Error(obj.message || 'Streaming error'));
                            } else if (obj.type === 'warn') {
                                // Optional: surface as non-blocking warning
                                console.warn('Stream warn:', obj.message);
                            } else {
                                collected = [...collected, obj];
                                setMatches(collected);
                            }
                        } catch (e) {
                            console.warn('Failed to parse NDJSON line', e);
                        }
                    }
                }

                // Flush any remaining buffered line
                const last = buffered.trim();
                if (last) {
                    try {
                        const obj = JSON.parse(last);
                        if (!obj.type) {
                            collected = [...collected, obj];
                            setMatches(collected);
                        }
                    } catch (e) {
                        console.warn('Failed to parse trailing NDJSON', e);
                    }
                }

                setError(null);
            } catch (streamErr) {
                console.warn('Streaming failed, falling back to non-streaming:', streamErr);
                const result = await candidateApi.matchCandidates(vacancyDescription);
                setMatches(result || []);
                setError(null);
            }
        } catch (err) {
            console.error('Candidate matching error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setMatches([]);
        setError(null);
        setLoading(false);
    }, []);

    return {
        matches,
        loading,
        error,
        matchCandidates,
        reset,
        setError,
    };
};

/**
 * Custom hook for health metrics
 * @returns {Object} Health metrics state and functions
 */
export const useHealthMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchMetrics = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            
            const { healthApi, costApi } = await import('../utils/apiClient');
            
            // Fetch multiple metrics in parallel
            const [healthResponse, operationResponse, tokenResponse, costResponse] = await Promise.allSettled([
                healthApi.getHealth(),
                healthApi.getOperationMetrics(),
                healthApi.getTokenMetrics(),
                costApi.getMetrics()
            ]);

            const metricsData = {
                health: healthResponse.status === 'fulfilled' ? healthResponse.value : null,
                operations: operationResponse.status === 'fulfilled' ? operationResponse.value : null,
                tokens: tokenResponse.status === 'fulfilled' ? tokenResponse.value : null,
                cost: costResponse.status === 'fulfilled' ? costResponse.value : null
            };

            setMetrics(metricsData);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message || 'Failed to fetch health metrics.');
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setMetrics(null);
        setError('');
        setLoading(true);
        setLastUpdated(null);
    }, []);

    return {
        metrics,
        loading,
        error,
        lastUpdated,
        fetchMetrics,
        reset,
    };
};

/**
 * Custom hook for admin prompt management
 * @returns {Object} Admin prompt state and functions
 */
export const useAdminPrompts = () => {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchPrompts = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const { adminApi } = await import('../utils/apiClient');
            const result = await adminApi.getPrompts();
            setPrompts(result);
        } catch (err) {
            setError(err.message || 'Failed to fetch prompts.');
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePrompt = useCallback(async (promptData) => {
        try {
            setError('');
            const { adminApi } = await import('../utils/apiClient');
            await adminApi.updatePrompt(promptData);
            await fetchPrompts();
            setSuccess('Prompt updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update prompt.');
        }
    }, [fetchPrompts]);

    const refreshPrompts = useCallback(async () => {
        try {
            setError('');
            const { adminApi } = await import('../utils/apiClient');
            await adminApi.refreshPrompts();
            await fetchPrompts();
            setSuccess('Prompts refreshed successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to refresh prompts.');
        }
    }, [fetchPrompts]);

    const resetPrompt = useCallback(async (type, role) => {
        try {
            setError('');
            const { adminApi } = await import('../utils/apiClient');
            await adminApi.resetPrompt(type, role);
            await fetchPrompts();
            setSuccess('Prompt reset to default successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset prompt.');
        }
    }, [fetchPrompts]);

    const clearMessages = useCallback(() => {
        setError('');
        setSuccess('');
    }, []);

    return {
        prompts,
        loading,
        error,
        success,
        fetchPrompts,
        updatePrompt,
        refreshPrompts,
        resetPrompt,
        clearMessages,
    };
};
