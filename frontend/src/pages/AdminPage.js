import React, { useState, useEffect } from 'react';
import { adminApi } from '../utils/apiClient';
import {
    Box,
    Button,
    Heading,
    Alert,
    AlertIcon,
    VStack,
    HStack,
    Card,
    CardBody,
    CardHeader,
    Badge,
    Text,
    Spinner,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Select,
    Textarea,
    Divider,
    IconButton,
    Tooltip,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from '@chakra-ui/react';
import { EditIcon, RepeatIcon, ViewIcon, CopyIcon, SettingsIcon } from '@chakra-ui/icons';

function AdminPage() {
    // General admin state
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Prompt management state
    const [prompts, setPrompts] = useState([]);
    const [promptsLoading, setPromptsLoading] = useState(true);
    const [promptsError, setPromptsError] = useState('');
    const [promptsSuccess, setPromptsSuccess] = useState('');
    const [, setEditingPrompt] = useState(null);
    const [editForm, setEditForm] = useState({ type: '', role: '', content: '' });
    const [refreshing, setRefreshing] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorder = useColorModeValue('gray.200', 'gray.700');
    const previewBg = useColorModeValue('gray.50', 'gray.700');

    useEffect(() => {
        fetchPrompts();
    }, []);

    const handleRefreshPrompts = async () => {
        setIsLoading(true);
        setNotification({ message: '', type: '' });
        try {
            await adminApi.refreshPrompts();
            setNotification({ message: 'Prompts updated successfully!', type: 'success' });
            await fetchPrompts(); // Refresh the prompts list
        } catch (error) {
            console.error("Error while updating prompts:", error);
            setNotification({ message: 'Failed to update prompts.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPrompts = async () => {
        try {
            setPromptsLoading(true);
            setPromptsError('');
            const data = await adminApi.getPrompts();
            setPrompts(data);
        } catch (err) {
            console.error('Error fetching prompts:', err);
            setPromptsError('Failed to fetch prompts. Make sure you are logged in as admin.');
        } finally {
            setPromptsLoading(false);
        }
    };

    const refreshPrompts = async () => {
        try {
            setRefreshing(true);
            setPromptsError('');
            await adminApi.refreshPrompts();
            await fetchPrompts();
            setPromptsSuccess('Prompts refreshed successfully');
            setTimeout(() => setPromptsSuccess(''), 3000);
        } catch (err) {
            console.error('Error refreshing prompts:', err);
            setPromptsError('Failed to refresh prompts');
        } finally {
            setRefreshing(false);
        }
    };

    const openEditModal = (prompt) => {
        setEditingPrompt(prompt);
        setEditForm({
            type: prompt.type,
            role: prompt.role,
            content: prompt.content
        });
        onOpen();
    };

    const closeEditModal = () => {
        setEditingPrompt(null);
        setEditForm({ type: '', role: '', content: '' });
        onClose();
    };

    const updatePrompt = async () => {
        try {
            setPromptsError('');
            await adminApi.updatePrompt(editForm);
            await fetchPrompts();
            closeEditModal();
            setPromptsSuccess('Prompt updated successfully');
            setTimeout(() => setPromptsSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating prompt:', err);
            setPromptsError('Failed to update prompt');
        }
    };

    const resetPrompt = async (type, role) => {
        try {
            setPromptsError('');
            await adminApi.resetPrompt(type, role);
            await fetchPrompts();
            setPromptsSuccess('Prompt reset to default successfully');
            setTimeout(() => setPromptsSuccess(''), 3000);
        } catch (err) {
            console.error('Error resetting prompt:', err);
            setPromptsError('Failed to reset prompt');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setPromptsSuccess('Content copied to clipboard');
        setTimeout(() => setPromptsSuccess(''), 2000);
    };

    const getPromptTypeColor = (type) => {
        return type === 'summary' ? 'blue' : 'green';
    };

    const getPromptRoleColor = (role) => {
        return role === 'system' ? 'purple' : 'orange';
    };

    const renderPromptManagement = () => {
        if (promptsLoading) {
            return (
                <Box display="flex" alignItems="center" justifyContent="center" minH="400px">
                    <VStack spacing={4}>
                        <Spinner size="lg" />
                        <Text>Loading prompts...</Text>
                    </VStack>
                </Box>
            );
        }

        return (
            <VStack spacing={6} align="stretch">
                {promptsError && (
                    <Alert status="error">
                        <AlertIcon />
                        {promptsError}
                    </Alert>
                )}

                {promptsSuccess && (
                    <Alert status="success">
                        <AlertIcon />
                        {promptsSuccess}
                    </Alert>
                )}

                {prompts.map((prompt) => (
                    <Card key={`${prompt.type}-${prompt.role}`} bg={cardBg} borderColor={cardBorder}>
                        <CardHeader>
                            <HStack justify="space-between" align="center">
                                <HStack spacing={3}>
                                    <Heading size="md" textTransform="capitalize">
                                        {prompt.type} - {prompt.role}
                                    </Heading>
                                    <Badge colorScheme={getPromptTypeColor(prompt.type)}>
                                        {prompt.type}
                                    </Badge>
                                    <Badge colorScheme={getPromptRoleColor(prompt.role)}>
                                        {prompt.role}
                                    </Badge>
                                    {prompt.cached && (
                                        <Badge colorScheme="green" variant="outline">
                                            Cached
                                        </Badge>
                                    )}
                                </HStack>
                                <HStack spacing={2}>
                                    <Tooltip label="View content">
                                        <IconButton
                                            icon={<ViewIcon />}
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(prompt.content)}
                                        />
                                    </Tooltip>
                                    <Tooltip label="Edit prompt">
                                        <IconButton
                                            icon={<EditIcon />}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="blue"
                                            onClick={() => openEditModal(prompt)}
                                        />
                                    </Tooltip>
                                    <Tooltip label="Reset to default">
                                        <IconButton
                                            icon={<RepeatIcon />}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="orange"
                                            onClick={() => resetPrompt(prompt.type, prompt.role)}
                                        />
                                    </Tooltip>
                                </HStack>
                            </HStack>
                        </CardHeader>
                        <CardBody>
                            <VStack align="stretch" spacing={3}>
                                <Text fontSize="sm" color="gray.600">
                                    <strong>File Path:</strong> {prompt.filePath}
                                </Text>
                                <Divider />
                                <Box>
                                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                                        Content Preview:
                                    </Text>
                                    <Box
                                        p={3}
                                        bg={previewBg}
                                        borderRadius="md"
                                        maxH="200px"
                                        overflowY="auto"
                                        position="relative"
                                    >
                                        <Text fontSize="sm" whiteSpace="pre-wrap">
                                            {prompt.content}
                                        </Text>
                                        <IconButton
                                            icon={<CopyIcon />}
                                            size="xs"
                                            position="absolute"
                                            top={2}
                                            right={2}
                                            variant="ghost"
                                            onClick={() => copyToClipboard(prompt.content)}
                                        />
                                    </Box>
                                </Box>
                            </VStack>
                        </CardBody>
                    </Card>
                ))}
            </VStack>
        );
    };

    return (
        <Box as="section" mb={8}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={4} mb={6}>
                <Heading as="h2" size="lg" display="flex" alignItems="center" gap={2}>
                    <SettingsIcon />
                    Admin Panel
                </Heading>
            </Box>

            {notification.message && (
                <Alert status={notification.type === 'success' ? 'success' : 'error'} mb={4}>
                    <AlertIcon />
                    {notification.message}
                </Alert>
            )}

            <Tabs>
                <TabList>
                    <Tab>System Management</Tab>
                    <Tab>Prompt Management</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel px={0}>
                        <VStack spacing={4} align="stretch">
                            <Card bg={cardBg} borderColor={cardBorder}>
                                <CardHeader>
                                    <Heading size="sm">Prompt Refresh</Heading>
                                </CardHeader>
                                <CardBody>
                                    <VStack spacing={4} align="stretch">
                                        <Text fontSize="sm" color="gray.600">
                                            Refresh all prompts from their files to reload the cache.
                                        </Text>
                                        <Button 
                                            onClick={handleRefreshPrompts} 
                                            isDisabled={isLoading} 
                                            colorScheme="purple"
                                            leftIcon={<RepeatIcon />}
                                        >
                                            {isLoading ? 'Updating...' : 'Refresh All Prompts'}
                                        </Button>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </VStack>
                    </TabPanel>

                    <TabPanel px={0}>
                        <VStack spacing={4} align="stretch">
                            <HStack justify="space-between" align="center">
                                <Heading size="md">Prompt Management</Heading>
                                <HStack spacing={3}>
                                    <Button
                                        onClick={fetchPrompts}
                                        leftIcon={<RepeatIcon />}
                                        colorScheme="blue"
                                        size="sm"
                                    >
                                        Reload
                                    </Button>
                                    <Button
                                        onClick={refreshPrompts}
                                        isLoading={refreshing}
                                        leftIcon={<RepeatIcon />}
                                        colorScheme="green"
                                        size="sm"
                                    >
                                        Refresh Cache
                                    </Button>
                                </HStack>
                            </HStack>
                            {renderPromptManagement()}
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            {/* Edit Modal */}
            <Modal isOpen={isOpen} onClose={closeEditModal} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Prompt</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <HStack spacing={4} w="full">
                                <FormControl>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        value={editForm.type}
                                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                        isDisabled
                                    >
                                        <option value="summary">Summary</option>
                                        <option value="rating">Rating</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                        isDisabled
                                    >
                                        <option value="system">System</option>
                                        <option value="user">User</option>
                                    </Select>
                                </FormControl>
                            </HStack>
                            <FormControl>
                                <FormLabel>Content</FormLabel>
                                <Textarea
                                    value={editForm.content}
                                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                    rows={12}
                                    placeholder="Enter prompt content..."
                                    fontFamily="mono"
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack spacing={3}>
                            <Button variant="ghost" onClick={closeEditModal}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" onClick={updatePrompt}>
                                Update Prompt
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default AdminPage;