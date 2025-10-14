import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Heading, 
    Text, 
    Stat, 
    StatLabel, 
    StatNumber, 
    StatHelpText, 
    StatArrow,
    SimpleGrid,
    Card,
    CardBody,
    CardHeader,
    Badge,
    Spinner,
    Alert,
    AlertIcon,
    Button,
    useColorModeValue,
    Flex,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { InfoIcon, RepeatIcon, DragHandleIcon } from '@chakra-ui/icons';
import { healthApi, costApi } from '../utils/apiClient';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Default card order - defined outside component to prevent infinite re-renders
const defaultCardOrder = [
    'system-health',
    'genai-operations',
    'token-usage',
    'api-costs',
    'input-tokens',
    'output-tokens',
    'operation-details',
    'token-details',
    'pricing-info',
    'latest-ai-call',
    'health-details'
];

// Sortable Card Component
function SortableCard({ id, children, cardBg, cardBorder }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            bg={cardBg}
            borderColor={cardBorder}
            position="relative"
        >
            <CardHeader>
                <Flex justify="space-between" align="center">
                    <Box flex="1">
                        {children}
                    </Box>
                    <Tooltip label="Drag to reorder">
                        <IconButton
                            {...attributes}
                            {...listeners}
                            icon={<DragHandleIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            aria-label="Drag to reorder"
                            cursor="grab"
                            _active={{ cursor: 'grabbing' }}
                        />
                    </Tooltip>
                </Flex>
            </CardHeader>
        </Card>
    );
}

function HealthPage() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [cardOrder, setCardOrder] = useState([]);

    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorder = useColorModeValue('gray.200', 'gray.700');

    // Load card order from localStorage on component mount
    useEffect(() => {
        const savedOrder = localStorage.getItem('health-page-card-order');
        if (savedOrder) {
            try {
                setCardOrder(JSON.parse(savedOrder));
            } catch (e) {
                console.warn('Failed to parse saved card order, using default');
                setCardOrder(defaultCardOrder);
            }
        } else {
            setCardOrder(defaultCardOrder);
        }
    }, []); // Empty dependency array since defaultCardOrder is now stable

    // Save card order to localStorage whenever it changes
    useEffect(() => {
        if (cardOrder.length > 0) {
            localStorage.setItem('health-page-card-order', JSON.stringify(cardOrder));
        }
    }, [cardOrder]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setCardOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError('');
            
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
            console.error('Error fetching metrics:', err);
            setError('Failed to fetch health metrics. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatNumber = (num) => {
        if (num === null || num === undefined) return 'N/A';
        return new Intl.NumberFormat().format(num);
    };

    const formatCurrency = (amount, currency = 'USD') => {
        if (amount === null || amount === undefined) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        }).format(amount);
    };

    const getHealthStatus = () => {
        if (!metrics?.health) return { status: 'unknown', color: 'gray' };
        const status = metrics.health.status;
        return {
            status: status,
            color: status === 'UP' ? 'green' : status === 'DOWN' ? 'red' : 'yellow'
        };
    };

    const healthStatus = getHealthStatus();

    // Function to render individual cards
    const renderCard = (cardId) => {
        switch (cardId) {
            case 'system-health':
                return (
                    <Box>
                        <Heading size="sm" mb={4}>System Health</Heading>
                        <Stat>
                            <StatLabel>Backend Status</StatLabel>
                            <StatNumber>
                                <Badge colorScheme={healthStatus.color} fontSize="md">
                                    {healthStatus.status}
                                </Badge>
                            </StatNumber>
                            <StatHelpText>
                                {metrics?.health?.status === 'UP' ? 'All systems operational' : 'System issues detected'}
                            </StatHelpText>
                        </Stat>
                    </Box>
                );

            case 'genai-operations':
                return (
                    <Box>
                        <Heading size="sm" mb={4}>GenAI Operations</Heading>
                        <Stat>
                            <StatLabel>Total Requests</StatLabel>
                            <StatNumber>
                                {formatNumber(metrics?.operations?.measurements?.[0]?.value)}
                            </StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                LLM API calls made
                            </StatHelpText>
                        </Stat>
                    </Box>
                );

            case 'token-usage':
                return (
                    <Box>
                        <Heading size="sm" mb={4}>Token Usage</Heading>
                        <Stat>
                            <StatLabel>Total Tokens</StatLabel>
                            <StatNumber>
                                {formatNumber(metrics?.tokens?.measurements?.[0]?.value)}
                            </StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                Tokens consumed
                            </StatHelpText>
                        </Stat>
                    </Box>
                );

            case 'api-costs':
                return (
                    <Box>
                        <Heading size="sm" mb={4}>API Costs</Heading>
                        <Stat>
                            <StatLabel>Total Cost</StatLabel>
                            <StatNumber>
                                {formatCurrency(metrics?.cost?.totalCost, metrics?.cost?.pricing?.currency)}
                            </StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                OpenAI API usage
                            </StatHelpText>
                        </Stat>
                    </Box>
                );

            case 'input-tokens':
                return (
                    <Box>
                        <Heading size="sm" mb={4}>Input Tokens</Heading>
                        <Stat>
                            <StatLabel>Total Input Tokens</StatLabel>
                            <StatNumber>
                                {formatNumber(metrics?.cost?.totalInputTokens)}
                            </StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                Prompt tokens
                            </StatHelpText>
                        </Stat>
                    </Box>
                );

            case 'output-tokens':
                return (
                    <Box>
                        <Heading size="sm" mb={4}>Output Tokens</Heading>
                        <Stat>
                            <StatLabel>Total Output Tokens</StatLabel>
                            <StatNumber>
                                {formatNumber(metrics?.cost?.totalOutputTokens)}
                            </StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                Response tokens
                            </StatHelpText>
                        </Stat>
                    </Box>
                );

            case 'operation-details':
                if (!metrics?.operations) return null;
                return (
                    <Box>
                        <Heading size="sm" mb={4}>Operation Details</Heading>
                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Base Unit:</strong> {metrics.operations.baseUnit || 'N/A'}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Description:</strong> {metrics.operations.description || 'N/A'}
                            </Text>
                        </Box>
                    </Box>
                );

            case 'token-details':
                if (!metrics?.tokens) return null;
                return (
                    <Box>
                        <Heading size="sm" mb={4}>Token Details</Heading>
                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Base Unit:</strong> {metrics.tokens.baseUnit || 'N/A'}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Description:</strong> {metrics.tokens.description || 'N/A'}
                            </Text>
                        </Box>
                    </Box>
                );

            case 'pricing-info':
                if (!metrics?.cost?.pricing) return null;
                return (
                    <Box>
                        <Heading size="sm" mb={4}>Pricing Information</Heading>
                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Input Tokens:</strong> {formatCurrency(metrics.cost.pricing.inputTokensPerMillion, metrics.cost.pricing.currency)} per 1M tokens
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Output Tokens:</strong> {formatCurrency(metrics.cost.pricing.outputTokensPerMillion, metrics.cost.pricing.currency)} per 1M tokens
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Currency:</strong> {metrics.cost.pricing.currency}
                            </Text>
                        </Box>
                    </Box>
                );

            case 'latest-ai-call':
                if (!metrics?.cost?.latestAiCall) return null;
                return (
                    <Box>
                        <Heading size="sm" mb={4}>Latest AI Call</Heading>
                        <Box>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Timestamp:</strong> {new Date(metrics.cost.latestAiCall.timestamp).toLocaleString()}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Input Tokens:</strong> {formatNumber(metrics.cost.latestAiCall.inputTokens)}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Output Tokens:</strong> {formatNumber(metrics.cost.latestAiCall.outputTokens)}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Total Tokens:</strong> {formatNumber(metrics.cost.latestAiCall.inputTokens + metrics.cost.latestAiCall.outputTokens)}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Input Cost:</strong> {formatCurrency(metrics.cost.latestAiCall.inputCost, metrics.cost.pricing?.currency)}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Output Cost:</strong> {formatCurrency(metrics.cost.latestAiCall.outputCost, metrics.cost.pricing?.currency)}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                <strong>Total Cost:</strong> {formatCurrency(metrics.cost.latestAiCall.totalCost, metrics.cost.pricing?.currency)}
                            </Text>
                        </Box>
                    </Box>
                );

            case 'health-details':
                if (!metrics?.health) return null;
                return (
                    <Box>
                        <Heading size="sm" mb={4}>Health Details</Heading>
                        <Box>
                            {Object.entries(metrics.health.components || {}).map(([key, value]) => (
                                <Box key={key} mb={2}>
                                    <Text fontSize="sm">
                                        <strong>{key}:</strong> 
                                        <Badge 
                                            ml={2} 
                                            colorScheme={value.status === 'UP' ? 'green' : 'red'}
                                            size="sm"
                                        >
                                            {value.status}
                                        </Badge>
                                    </Text>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box as="section" mb={8}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={4} mb={6}>
                <Heading as="h2" size="lg" display="flex" alignItems="center" gap={2}>
                    <InfoIcon />
                    System Health & GenAI Metrics
                </Heading>
                <Button 
                    onClick={fetchMetrics} 
                    isLoading={loading}
                    leftIcon={<RepeatIcon />}
                    colorScheme="blue"
                    size="sm"
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {loading && !metrics && (
                <Box display="flex" alignItems="center" gap={3} mb={4}>
                    <Spinner size="sm" />
                    <Text>Loading metrics...</Text>
                </Box>
            )}

            {lastUpdated && (
                <Text fontSize="sm" color="gray.500" mb={4}>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </Text>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={cardOrder}
                    strategy={verticalListSortingStrategy}
                >
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {cardOrder.map((cardId) => {
                            const cardContent = renderCard(cardId);
                            if (!cardContent) return null;
                            
                            return (
                                <SortableCard
                                    key={cardId}
                                    id={cardId}
                                    cardBg={cardBg}
                                    cardBorder={cardBorder}
                                >
                                    <CardBody>
                                        {cardContent}
                                    </CardBody>
                                </SortableCard>
                            );
                        })}
                    </SimpleGrid>
                </SortableContext>
            </DndContext>
        </Box>
    );
}

export default HealthPage;
