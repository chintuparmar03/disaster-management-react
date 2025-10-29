import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ============ INTERFACES ============

interface CitizenRegistrationData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  aadhar_number: string;
  address: string;
  latitude?: number;
  longitude?: number;
  location_permission?: boolean;
}

interface LoginData {
  username_or_phone: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

interface RegistrationResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  aadhar_number: string;
  address: string;
  message: string;
}

interface ProfileResponse extends CitizenRegistrationData {
  id: number;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface ErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: any;
}

interface EmergencyReportData {
  disaster_type: string;
  full_address: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

interface EmergencyResponse {
  incident_id: string;
  status: string;
  message: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  location_permission: boolean;
}

interface ReverseGeocodingResponse {
  full_address: string;
  pincode: string;
  city: string;
  state: string;
}

// ============ API CLIENT SETUP ============

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor - Add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error.message);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.status}`, response.data);
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    console.error('[API Response Error]', error.response?.status, error.response?.data);

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('citizen_data');
      window.location.href = '/citizen-login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// ============ CITIZEN REGISTRATION & LOGIN ============

/**
 * Register a new citizen
 * @param formData - Citizen registration form data
 * @returns Promise with registration response
 */
export const registerCitizen = async (
  formData: CitizenRegistrationData
): Promise<AxiosResponse<RegistrationResponse>> => {
  try {
    console.log('[Register] Submitting citizen registration:', {
      ...formData,
      password: '***',
    });

    const response = await apiClient.post<RegistrationResponse>(
      '/citizen/citizens/',
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        aadhar_number: formData.aadhar_number,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        location_permission: formData.location_permission ?? true,
      }
    );

    console.log('[Register Success]', response.data);
    return response;
  } catch (error) {
    console.error('[Register Error]', error);
    throw error;
  }
};

/**
 * Login citizen with username/phone and password
 * @param loginData - Login credentials
 * @returns Promise with login response containing tokens
 */
export const loginCitizen = async (
  loginData: LoginData
): Promise<AxiosResponse<LoginResponse>> => {
  try {
    console.log('[Login] Submitting login request for:', loginData.username_or_phone);

    const response = await apiClient.post<LoginResponse>('/citizen/citizens/login/', {
      username_or_phone: loginData.username_or_phone,
      password: loginData.password,
    });

    console.log('[Login Success] Tokens received');

    // Store tokens
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }

    // Store user data
    if (response.data.user) {
      localStorage.setItem('citizen_data', JSON.stringify(response.data.user));
    }

    return response;
  } catch (error) {
    console.error('[Login Error]', error);
    throw error;
  }
};

// ============ CITIZEN PROFILE MANAGEMENT ============

/**
 * Get current citizen profile
 * @returns Promise with profile data
 */
export const getCitizenProfile = async (): Promise<AxiosResponse<ProfileResponse>> => {
  try {
    console.log('[Profile] Fetching profile...');

    const response = await apiClient.get<ProfileResponse>('/api/citizens/profile/');

    console.log('[Profile Success]', response.data);
    return response;
  } catch (error) {
    console.error('[Profile Error]', error);
    throw error;
  }
};

/**
 * Update citizen profile
 * @param formData - Partial profile data to update
 * @returns Promise with updated profile
 */
export const updateCitizenProfile = async (
  formData: Partial<CitizenRegistrationData>
): Promise<AxiosResponse<ProfileResponse>> => {
  try {
    console.log('[Update Profile] Submitting update:', formData);

    const response = await apiClient.put<ProfileResponse>(
      '/api/citizens/profile/',
      formData
    );

    console.log('[Update Profile Success]', response.data);
    return response;
  } catch (error) {
    console.error('[Update Profile Error]', error);
    throw error;
  }
};

/**
 * Get all citizens (Admin only)
 * @returns Promise with list of all citizens
 */
export const getAllCitizens = async (): Promise<AxiosResponse<ProfileResponse[]>> => {
  try {
    console.log('[Get All Citizens] Fetching all citizens...');

    const response = await apiClient.get<ProfileResponse[]>('/api/citizens/');

    console.log('[Get All Citizens Success]', response.data.length);
    return response;
  } catch (error) {
    console.error('[Get All Citizens Error]', error);
    throw error;
  }
};

// ============ LOCATION MANAGEMENT ============

/**
 * Update citizen location and location permission
 * @param locationData - Location coordinates and permission status
 * @returns Promise with updated location
 */
export const updateLocation = async (
  locationData: LocationData
): Promise<AxiosResponse<{ latitude: number; longitude: number; location_permission: boolean }>> => {
  try {
    console.log('[Update Location] Submitting location:', locationData);

    const response = await apiClient.patch(
      '/api/citizens/location/',
      {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        location_permission: locationData.location_permission,
      }
    );

    console.log('[Update Location Success]', response.data);
    return response;
  } catch (error) {
    console.error('[Update Location Error]', error);
    throw error;
  }
};

/**
 * Get reverse geocoding (convert coordinates to address)
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Promise with address information
 */
export const getReverseGeocoding = async (
  latitude: number,
  longitude: number
): Promise<AxiosResponse<ReverseGeocodingResponse>> => {
  try {
    console.log('[Reverse Geocoding] Fetching address for:', { latitude, longitude });

    const response = await apiClient.get<ReverseGeocodingResponse>(
      '/api/geocoding/reverse/',
      {
        params: {
          latitude,
          longitude,
        },
      }
    );

    console.log('[Reverse Geocoding Success]', response.data);
    return response;
  } catch (error) {
    console.error('[Reverse Geocoding Error]', error);
    throw error;
  }
};

// ============ EMERGENCY REPORTING ============

/**
 * Report emergency/disaster (SOS)
 * @param emergencyData - Emergency incident data
 * @returns Promise with emergency report response
 */
export const reportEmergencySOS = async (
  emergencyData: EmergencyReportData
): Promise<AxiosResponse<EmergencyResponse>> => {
  try {
    console.log('[Report Emergency] Submitting emergency report:', emergencyData);

    const response = await apiClient.post<EmergencyResponse>(
      '/agency/report-sos/',
      {
        disaster_type: emergencyData.disaster_type,
        full_address: emergencyData.full_address,
        pincode: emergencyData.pincode,
        latitude: emergencyData.latitude,
        longitude: emergencyData.longitude,
      }
    );

    console.log('[Report Emergency Success]', response.data);
    return response;
  } catch (error) {
    console.error('[Report Emergency Error]', error);
    throw error;
  }
};

// ============ AUTHENTICATION UTILITIES ============

/**
 * Logout citizen and clear stored data
 */
export const logoutCitizen = (): void => {
  console.log('[Logout] Clearing authentication data');

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('citizen_data');

  // Reset API authorization header
  delete apiClient.defaults.headers.common['Authorization'];

  console.log('[Logout] Success');
  window.location.href = '/citizen-login';
};

/**
 * Check if user is authenticated
 * @returns boolean indicating authentication status
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

/**
 * Get stored citizen data
 * @returns Parsed citizen data or null
 */
export const getCitizenData = (): { id: number; username: string; email: string } | null => {
  const data = localStorage.getItem('citizen_data');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('[Get Citizen Data Error]', error);
      return null;
    }
  }
  return null;
};

/**
 * Get access token
 * @returns Access token or null
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// ============ ERROR HANDLING UTILITIES ============

/**
 * Extract error message from API response
 * @param error - Axios error object
 * @returns Human-readable error message
 */
export const getErrorMessage = (error: AxiosError<ErrorResponse>): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An error occurred. Please try again.';
};

export default apiClient;