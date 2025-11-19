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

// Request Interceptor - Add token to headers and log requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Enhanced logging for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
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
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    console.error('[API Response Error]', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

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
    console.log('[Register] Submitting citizen registration for:', formData.username);

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

    console.log('[Get All Citizens Success] Retrieved', response.data.length, 'citizens');
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
    console.log('[Update Location] Submitting location:', {
      latitude: locationData.latitude.toFixed(6),
      longitude: locationData.longitude.toFixed(6),
      location_permission: locationData.location_permission
    });

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
 * @param latitude - Latitude coordinate (must be between -90 and 90)
 * @param longitude - Longitude coordinate (must be between -180 and 180)
 * @returns Promise with address information
 */
export const getReverseGeocoding = async (
  latitude: number,
  longitude: number
): Promise<AxiosResponse<ReverseGeocodingResponse>> => {
  try {
    // Validate coordinates before sending
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      throw new Error(`Invalid coordinates: Lat=${latitude}, Lng=${longitude}`);
    }

    console.log('[Reverse Geocoding] Fetching address for:', {
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6)
    });

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
 * @param emergencyData - Emergency incident data with valid coordinates
 * @returns Promise with emergency report response
 */
export const reportEmergencySOS = async (
  emergencyData: EmergencyReportData
): Promise<AxiosResponse<EmergencyResponse>> => {
  try {
    // Validate coordinates before sending to backend
    if (Math.abs(emergencyData.latitude) > 90 || Math.abs(emergencyData.longitude) > 180) {
      console.error('[Report Emergency] Invalid coordinates:', emergencyData);
      throw new Error(
        `Invalid coordinates received: Latitude=${emergencyData.latitude}, Longitude=${emergencyData.longitude}. ` +
        `Valid ranges: Latitude [-90, 90], Longitude [-180, 180]`
      );
    }

    console.log('[Report Emergency] Submitting emergency report:', {
      disaster_type: emergencyData.disaster_type,
      latitude: emergencyData.latitude.toFixed(6),
      longitude: emergencyData.longitude.toFixed(6),
      full_address: emergencyData.full_address,
      pincode: emergencyData.pincode
    });

    const response = await apiClient.post<EmergencyResponse>(
      '/agency/sos/report/',
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
export const getCitizenData = (): { id: number; username: string; email: string; first_name?: string; last_name?: string; phone_number?: string } | null => {
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
 * Extract and format error message from API response
 * @param error - Axios error object
 * @returns Human-readable error message
 */
export const getErrorMessage = (error: AxiosError<ErrorResponse>): string => {
  console.log('[Error Handler] Processing error:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });

  // Check for specific error details in response
  if (error.response?.data?.detail) {
    return String(error.response.data.detail);
  }
  
  if (error.response?.data?.message) {
    return String(error.response.data.message);
  }
  
  if (error.response?.data?.error) {
    return String(error.response.data.error);
  }

  // Handle specific HTTP status codes
  if (error.response?.status === 400) {
    return 'Invalid request. Please check your input and try again.';
  }

  if (error.response?.status === 401) {
    return 'Session expired. Please login again.';
  }

  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }

  if (error.response?.status === 500) {
    return 'Server error. Please try again later or contact support.';
  }

  if (error.message === 'Network Error') {
    return 'Network error. Please check your internet connection.';
  }

  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  return error.message || 'An error occurred. Please try again.';
};

export default apiClient;