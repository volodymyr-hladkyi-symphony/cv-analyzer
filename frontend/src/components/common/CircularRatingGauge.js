/**
 * CircularRatingGauge component for displaying candidate ratings as circular progress
 * Uses Chakra UI Box with SVG to create a circular progress indicator
 */

import React from 'react';
import { Box, Text, Flex, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { getRatingColors } from '../../utils/colorUtils';

/**
 * CircularRatingGauge component
 * @param {Object} props - Component props
 * @param {number} props.rating - Current rating value
 * @param {number} props.minRating - Minimum rating value
 * @param {number} props.maxRating - Maximum rating value
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {boolean} props.showValue - Whether to show the numeric value
 * @param {boolean} props.showTooltip - Whether to show tooltip on hover
 * @returns {JSX.Element} CircularRatingGauge component
 */
const CircularRatingGauge = ({ 
    rating, 
    minRating, 
    maxRating, 
    size = 'md',
    showValue = true,
    showTooltip = true 
}) => {
    const colors = getRatingColors(rating, minRating, maxRating);
    const percentage = ((rating - minRating) / (maxRating - minRating)) * 100;
    
    // Color mode-aware stroke color for SVG background circle
    const strokeColor = useColorModeValue('gray.200', 'gray.700');
    
    // Size configurations
    const sizeConfig = {
        sm: { size: 60, strokeWidth: 4, fontSize: 'xs', innerFontSize: 'xs' },
        md: { size: 80, strokeWidth: 6, fontSize: 'sm', innerFontSize: 'sm' },
        lg: { size: 100, strokeWidth: 8, fontSize: 'md', innerFontSize: 'lg' }
    };
    
    const config = sizeConfig[size];
    const radius = (config.size - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const gaugeElement = (
        <Box>
            <Flex align="center" gap={3} mb={2}>
                <Text fontSize={config.fontSize} fontWeight="medium" color="gray.600">
                    Rating:
                </Text>
                {showValue && (
                    <Text 
                        fontSize={config.fontSize} 
                        fontWeight="bold" 
                        color={colors.textColor}
                    >
                        {rating}/{maxRating}
                    </Text>
                )}
            </Flex>
            
            <Box position="relative" display="inline-block">
                <svg
                    width={config.size}
                    height={config.size}
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    {/* Background circle */}
                    <circle
                        cx={config.size / 2}
                        cy={config.size / 2}
                        r={radius}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={config.strokeWidth}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={config.size / 2}
                        cy={config.size / 2}
                        r={radius}
                        fill="none"
                        stroke={colors.colorScheme}
                        strokeWidth={config.strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                            transition: 'stroke-dashoffset 0.5s ease-in-out',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}
                    />
                </svg>
                
                {/* Center text */}
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    textAlign="center"
                >
                    <Text 
                        fontSize={config.innerFontSize} 
                        fontWeight="bold" 
                        color={colors.textColor}
                        lineHeight="1"
                    >
                        {rating}
                    </Text>
                    <Text 
                        fontSize="xs" 
                        color="gray.500"
                        lineHeight="1"
                    >
                        /{maxRating}
                    </Text>
                </Box>
            </Box>
            
            {/* Rating range indicators */}
            <Flex justify="space-between" mt={2} fontSize="xs" color="gray.500">
                <Text>{minRating}</Text>
                <Text>{maxRating}</Text>
            </Flex>
        </Box>
    );
    
    if (showTooltip) {
        return (
            <Tooltip 
                label={`Rating: ${rating}/${maxRating} (${percentage.toFixed(1)}%)`}
                placement="top"
                hasArrow
            >
                {gaugeElement}
            </Tooltip>
        );
    }
    
    return gaugeElement;
};

export default CircularRatingGauge;
