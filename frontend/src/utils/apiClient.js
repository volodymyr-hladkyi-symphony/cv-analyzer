/**
 * API client utilities for consistent API communication
 * Provides centralized API configuration and error handling
 */

import axios from 'axios';

/**
 * Create configured axios instance
 */
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
    CANDIDATE_MATCH: '/api/candidate-matcher/match',
    CANDIDATE_MATCH_STREAM: '/api/candidate-matcher/match/stream',
    COST_METRICS: '/api/cost/metrics',
    COST_PRICING: '/api/cost/pricing',
    ADMIN_PROMPTS: '/api/admin/prompts',
    ADMIN_PROMPTS_REFRESH: '/api/admin/prompts/refresh',
    RATING_CONFIG: '/api/rating/config',
    HEALTH: '/actuator/health',
    METRICS_OPERATIONS: '/actuator/metrics/gen_ai.client.operation',
    METRICS_TOKENS: '/actuator/metrics/gen_ai.client.token.usage',
};

/**
 * Rating config API functions
 */
export const ratingConfigApi = {
    /**
     * Get rating config
     * @returns {Promise<Object>} Rating config data
     */
    getConfig: () => 
        handleApiRequest(
            () => apiClient.get(API_ENDPOINTS.RATING_CONFIG),
            'Failed to fetch rating config'
        ),
};

/**
 * Generic API request handler with enhanced error handling
 * @param {Function} requestFn - The API request function
 * @param {string} errorMessage - Custom error message
 * @returns {Promise} API response or throws error
 */
export const handleApiRequest = async (requestFn, errorMessage = 'API request failed') => {
    try {
        const response = await requestFn();
        return response.data;
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        
        // Enhanced error handling - preserve the original error structure
        // The frontend components will parse this error appropriately
        if (error.response) {
            // Server responded with error status - preserve the full error response
            error.userMessage = errorMessage;
            throw error;
        } else if (error.request) {
            // Request was made but no response received
            const networkError = new Error(`${errorMessage}: Network error - please check your connection`);
            networkError.isNetworkError = true;
            networkError.originalError = error;
            throw networkError;
        } else {
            // Something else happened
            const genericError = new Error(`${errorMessage}: ${error.message}`);
            genericError.originalError = error;
            throw genericError;
        }
    }
};

/**
 * Candidate matching API functions
 */
export const candidateApi = {
    /**
     * Match candidates based on vacancy description
     * @param {string} vacancyDescription - Job description
     * @returns {Promise<Array>} Array of candidate matches
     */
    matchCandidates: (vacancyDescription) => 
        handleApiRequest(
            () => apiClient.post(API_ENDPOINTS.CANDIDATE_MATCH, { vacancyDescription }),
            'Failed to find candidates'
        ),

    /**
     * Stream candidates using NDJSON. Returns a Response object.
     * @param {string} vacancyDescription - Job description for matching
     * @returns {Promise<Response>} Fetch Response object with readable stream
     */
    streamMatchCandidates: async (vacancyDescription) => {
        const baseUrl = apiClient.defaults.baseURL;
        if (!baseUrl) {
            throw new Error('API base URL is not configured');
        }
        const url = `${baseUrl}${API_ENDPOINTS.CANDIDATE_MATCH_STREAM}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...apiClient.defaults.headers.common, // Include default headers
                },
                body: JSON.stringify({ vacancyDescription }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const error = new Error(`Failed to find candidates: Streaming request failed with status ${response.status}`);
                error.status = response.status;
                error.userMessage = 'Failed to find candidates';
                throw error;
            }
            
            if (!response.body) {
                throw new Error('Failed to find candidates: Response body is not readable');
            }
            
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                const timeoutError = new Error('Failed to find candidates: Request timeout');
                timeoutError.isTimeout = true;
                throw timeoutError;
            }
            throw error;
        }
    },
};

/**
 * Cost tracking API functions
 */
export const costApi = {
    /**
     * Get cost metrics
     * @returns {Promise<Object>} Cost metrics data
     */
    getMetrics: () => 
        handleApiRequest(
            () => apiClient.get(API_ENDPOINTS.COST_METRICS),
            'Failed to fetch cost metrics'
        ),
    
    /**
     * Get pricing information
     * @returns {Promise<Object>} Pricing data
     */
    getPricing: () => 
        handleApiRequest(
            () => apiClient.get(API_ENDPOINTS.COST_PRICING),
            'Failed to fetch pricing information'
        ),
};

/**
 * Admin API functions
 */
export const adminApi = {
    /**
     * Get all prompts
     * @returns {Promise<Array>} Array of prompts
     */
    getPrompts: () => 
        handleApiRequest(
            () => apiClient.get(API_ENDPOINTS.ADMIN_PROMPTS),
            'Failed to fetch prompts'
        ),
    
    /**
     * Update prompt
     * @param {Object} promptData - Prompt data to update
     * @returns {Promise<Object>} Updated prompt
     */
    updatePrompt: (promptData) => 
        handleApiRequest(
            () => apiClient.put(API_ENDPOINTS.ADMIN_PROMPTS, promptData),
            'Failed to update prompt'
        ),
    
    /**
     * Refresh prompts cache
     * @returns {Promise<Object>} Refresh result
     */
    refreshPrompts: () => 
        handleApiRequest(
            () => apiClient.post(API_ENDPOINTS.ADMIN_PROMPTS_REFRESH),
            'Failed to refresh prompts'
        ),
    
    /**
     * Reset prompt to default
     * @param {string} type - Prompt type
     * @param {string} role - Prompt role
     * @returns {Promise<Object>} Reset result
     */
    resetPrompt: (type, role) => 
        handleApiRequest(
            () => apiClient.post(`${API_ENDPOINTS.ADMIN_PROMPTS}/${type}/${role}/reset`),
            'Failed to reset prompt'
        ),
};

/**
 * Health and metrics API functions
 */
export const healthApi = {
    /**
     * Get system health
     * @returns {Promise<Object>} Health data
     */
    getHealth: () => 
        handleApiRequest(
            () => apiClient.get(API_ENDPOINTS.HEALTH),
            'Failed to fetch health status'
        ),
    
    /**
     * Get operation metrics
     * @returns {Promise<Object>} Operation metrics
     */
    getOperationMetrics: () => 
        handleApiRequest(
            () => apiClient.get(API_ENDPOINTS.METRICS_OPERATIONS),
            'Failed to fetch operation metrics'
        ),
    
    /**
     * Get token usage metrics
     * @returns {Promise<Object>} Token metrics
     */
    getTokenMetrics: () => 
        handleApiRequest(
            () => apiClient.get(API_ENDPOINTS.METRICS_TOKENS),
            'Failed to fetch token metrics'
        ),
};

export default apiClient;
