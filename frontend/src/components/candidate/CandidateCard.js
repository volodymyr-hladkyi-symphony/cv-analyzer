/**
 * CandidateCard component for displaying individual candidate information
 * Displays candidate details with color-coded rating
 */

import React from 'react';
import { Box, Heading, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import { getRatingColors } from '../../utils/colorUtils';
import CircularRatingGauge from '../common/CircularRatingGauge';
import useRatingConfig from '../../hooks/useRatingConfig';

/**
 * CandidateCard component
 * @param {Object} props - Component props
 * @param {Object} props.candidate - Candidate data object
 * @param {string} props.candidate.name - Candidate name
 * @param {string} props.candidate.filename - CV filename
 * @param {string} props.candidate.summary - AI-generated summary
 * @param {number} props.candidate.rating - Rating score
 * @returns {JSX.Element} CandidateCard component
 */
const CandidateCard = ({ candidate }) => {
    const { ratingConfig } = useRatingConfig();
    const colors = getRatingColors(candidate.rating, ratingConfig.minRating, ratingConfig.maxRating);
    
    // Color mode-aware background for summary text area
    const summaryBg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Box 
            bg={colors.backgroundColor} 
            borderWidth="2px" 
            borderColor={colors.borderColor} 
            borderRadius="md" 
            p={4}
            transition="all 0.2s"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
        >
            <Flex justify="space-between" align="center" mb={2}>
                <Heading as="h3" size="md" color={colors.textColor}>
                    {candidate.name}
                </Heading>
            </Flex>
            
            <Text fontSize="sm" color="gray.600" mb={3}>
                <strong>File:</strong> {candidate.filename}
            </Text>
            
            <Box mb={4}>
                <CircularRatingGauge 
                    rating={candidate.rating}
                    minRating={ratingConfig.minRating}
                    maxRating={ratingConfig.maxRating}
                    size="md"
                    showValue={true}
                    showTooltip={true}
                />
            </Box>
            
            <Heading as="h4" size="sm" mb={2}>
                Analysis Result
            </Heading>
            
            <Box 
                as="pre" 
                whiteSpace="pre-wrap" 
                wordBreak="break-word" 
                bg={summaryBg}
                p={3} 
                borderRadius="sm" 
                fontSize="sm" 
                color="inherit"
            >
                {candidate.summary}
            </Box>
        </Box>
    );
};

export default CandidateCard;
