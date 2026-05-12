import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Include cookies for authentication
    headers: {
        'Content-Type': 'application/json',
    },
});

const getErrorMessage = (error, fallbackMessage) => {
    if (error.response?.data) {
        const responseData = error.response.data;

        if (typeof responseData === 'string') {
            return responseData;
        }

        if (responseData.detail) {
            return responseData.detail;
        }

        const fieldErrors = Object.entries(responseData)
            .map(([field, messages]) => {
                const formattedMessages = Array.isArray(messages) ? messages.join(', ') : messages;
                return `${field}: ${formattedMessages}`;
            })
            .join(' | ');

        if (fieldErrors) {
            return fieldErrors;
        }
    }

    if (error.request) {
        return 'Unable to reach the backend server. Make sure Django is running.';
    }

    return fallbackMessage;
};

const handleApiError = (error, fallbackMessage) => {
    const message = getErrorMessage(error, fallbackMessage);
    console.error(message, error);
    throw new Error(message);
};

const getData = async (endpoint, fallbackMessage = 'Unable to load data.') => {
    try {
        const response = await apiClient.get(endpoint);
        return response.data;
    } catch (error) {
        handleApiError(error, fallbackMessage);
    }
};

const createData = async (endpoint, payload, fallbackMessage = 'Unable to create record.') => {
    try {
        const csrfHeaders = await getCsrfHeaders();
        const response = await apiClient.post(endpoint, payload, {
            headers: csrfHeaders,
        });
        return response.data;
    } catch (error) {
        handleApiError(error, fallbackMessage);
    }
};

const updateData = async (endpoint, id, payload, fallbackMessage = 'Unable to update record.') => {
    try {
        const csrfHeaders = await getCsrfHeaders();
        const response = await apiClient.patch(`${endpoint}${id}/`, payload, {
            headers: csrfHeaders,
        });
        return response.data;
    } catch (error) {
        handleApiError(error, fallbackMessage);
    }
};

const deleteData = async (endpoint, id, fallbackMessage = 'Unable to delete record.') => {
    try {
        const csrfHeaders = await getCsrfHeaders();
        await apiClient.delete(`${endpoint}${id}/`, {
            headers: csrfHeaders,
        });
    } catch (error) {
        handleApiError(error, fallbackMessage);
    }
};

export const getDashboardSummary = () => getData('/dashboard-summary/', 'Unable to load dashboard summary.');
export const getReleaseReadiness = () => getData('/release-readiness/', 'Unable to load release readiness data.');

export const getIssues = () => getData('/issues/', 'Unable to load issues.');
export const getIssue = (id) => getData(`/issues/${id}/`, 'Unable to load issue details.');
export const createIssue = (payload) => createData('/issues/', payload, 'Unable to create issue.');
export const updateIssue = (id, payload) => updateData('/issues/', id, payload, 'Unable to update issue.');
export const deleteIssue = (id) => deleteData('/issues/', id, 'Unable to delete issue.');

export const getReleases = () => getData('/releases/', 'Unable to load releases.');
export const createRelease = (payload) => createData('/releases/', payload, 'Unable to create release.');
export const updateRelease = (id, payload) => updateData('/releases/', id, payload, 'Unable to update release.');
export const deleteRelease = (id) => deleteData('/releases/', id, 'Unable to delete release.');

export const getDeploymentLogs = () => getData('/deployment-logs/', 'Unable to load deployment logs.');
export const createDeploymentLog = (payload) => createData('/deployment-logs/', payload, 'Unable to create deployment log.');
export const updateDeploymentLog = (id, payload) => updateData('/deployment-logs/', id, payload, 'Unable to update deployment log.');
export const deleteDeploymentLog = (id) => deleteData('/deployment-logs/', id, 'Unable to delete deployment log.');
export const getQANotes = () => (getData('/qa-notes/', 'Unable to load QA notes.'));
export const createQANote = (payload) => (createData('/qa-notes/', payload, 'Unable to create QA note.'));
export const updateQANote = (id, payload) => (updateData('/qa-notes/', id, payload, 'Unable to update QA note.'));
export const deleteQANote = (id) => (deleteData('/qa-notes/', id, 'Unable to delete QA note.'));

const getCookie = (name) => {
    const cookies = document.cookie ? document.cookie.split('; ') : [];

    const matchingCookie = cookies.find((cookie) => (
        cookie.startsWith(`${name}=`)
    ));

    if (!matchingCookie) {
        return null;
    }

    return decodeURIComponent(matchingCookie.split('=')[1]);
};

export const getCsrfToken = async () => {
    try {
        const response = await apiClient.get('/csrf/');
        return response.data.csrfToken;
    } catch (error) {
        handleApiError(error, 'Unable to get CSRF token.');
    }
};

const getCsrfHeaders = async () => {
    const tokenFromResponse = await getCsrfToken();
    const tokenFromCookie = getCookie('csrftoken');

    return {
        'X-CSRFToken': tokenFromCookie || tokenFromResponse,
    };
};

export const loginUser = async (credentials) => {
    try {
        const csrfHeaders = await getCsrfHeaders();

        const response = await apiClient.post('/login/', credentials, {
            headers: csrfHeaders,
        });

        return response.data;
    } catch (error) {
        handleApiError(error, 'Unable to log in.');
    }
};

export const logoutUser = async () => {
    try {
        const csrfHeaders = await getCsrfHeaders();

        const response = await apiClient.post('/logout/', {}, {
            headers: csrfHeaders,
        });

        return response.data;
    } catch (error) {
        handleApiError(error, 'Unable to log out.');
    }
};

export const getSessionUser = () => (
    getData('/session-user/', 'Unable to load current session user.')
);

export const updateSessionUser = async (payload) => {
    try {
        const csrfHeaders = await getCsrfHeaders();

        const response = await apiClient.patch('/session-user/', payload, {
            headers: csrfHeaders,
        });

        return response.data;
    } catch (error) {
        handleApiError(error, 'Unable to update account.');
    }
};



export default apiClient;