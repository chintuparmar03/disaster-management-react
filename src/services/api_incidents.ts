import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Construct base URL with /agency prefix
const AGENCY_BASE_URL = `${API_BASE_URL}/agency`;

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface SOSIncident {
  id: number;
  citizen: User;
  disaster_type: string;
  disaster_type_display: string;
  full_address: string;
  pincode: string;
  latitude: number;
  longitude: number;
  status: string;
  status_display: string;
  incident_time: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentListResponse {
  success: boolean;
  message: string;
  data: SOSIncident[];
  count?: number;
  next?: string;
  previous?: string;
}

export interface IncidentDetailResponse {
  success: boolean;
  message: string;
  data: SOSIncident;
}

export interface StatusUpdatePayload {
  status: string;
  status_reason?: string;
}

export interface StatusUpdateResponse {
  success: boolean;
  message: string;
  data: SOSIncident;
}

export interface FilterParams {
  status?: string;
  disaster_type?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// API Service Class
class IncidentAPIService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: AGENCY_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptor to include auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('agencyToken');
        if (token) {
          config.headers.Authorization = `Token ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('agencyToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Extract incidents from paginated response
   * Django's get_paginated_response wraps data in results.data
   */
  private extractIncidents(response: any): SOSIncident[] {
    console.log('Raw API Response:', response);
    
    // Handle paginated response structure from Django REST Framework
    if (response.results?.data) {
      console.log('Found incidents in results.data');
      return response.results.data;
    }
    
    // Handle direct data array
    if (Array.isArray(response.data)) {
      console.log('Found incidents in data array');
      return response.data;
    }
    
    // Fallback: return empty array
    console.log('No incidents found in response');
    return [];
  }

  /**
   * Fetch all active SOS incidents with filters
   */
  async getActiveIncidents(filters?: FilterParams): Promise<IncidentListResponse> {
    try {
      const response = await this.axiosInstance.get<any>(
        '/sos/incidents/',
        {
          params: {
            status: filters?.status || 'PENDING',
            disaster_type: filters?.disaster_type,
            search: filters?.search,
            ordering: filters?.ordering || '-incident_time',
            page: filters?.page || 1,
            page_size: filters?.page_size || 50,
          },
        }
      );
      
      const incidents = this.extractIncidents(response.data);
      
      return {
        success: true,
        message: 'Incidents retrieved successfully',
        data: incidents,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch incidents by disaster type
   */
  async getIncidentsByDisasterType(
    disasterType: string,
    filters?: FilterParams
  ): Promise<IncidentListResponse> {
    try {
      const response = await this.axiosInstance.get<any>(
        '/sos/incidents/',
        {
          params: {
            disaster_type: disasterType,
            status: filters?.status || 'PENDING',
            search: filters?.search,
            ordering: filters?.ordering || '-incident_time',
          },
        }
      );
      
      const incidents = this.extractIncidents(response.data);
      
      return {
        success: true,
        message: 'Incidents retrieved successfully',
        data: incidents,
        count: response.data.count,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch a specific incident by ID
   */
  async getIncidentDetail(incidentId: number): Promise<IncidentDetailResponse> {
    try {
      const response = await this.axiosInstance.get<IncidentDetailResponse>(
        `/sos/incidents/${incidentId}/`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update incident status
   */
  async updateIncidentStatus(
    incidentId: number,
    payload: StatusUpdatePayload
  ): Promise<StatusUpdateResponse> {
    try {
      const response = await this.axiosInstance.patch<StatusUpdateResponse>(
        `/sos/incidents/${incidentId}/update-status/`,
        payload
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get incidents filtered by status
   */
  async getIncidentsByStatus(status: string): Promise<IncidentListResponse> {
    try {
      const response = await this.axiosInstance.get<any>(
        '/sos/incidents/',
        {
          params: {
            status,
            ordering: '-incident_time',
          },
        }
      );
      
      const incidents = this.extractIncidents(response.data);
      
      return {
        success: true,
        message: 'Incidents retrieved successfully',
        data: incidents,
        count: response.data.count,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search incidents
   */
  async searchIncidents(searchTerm: string): Promise<IncidentListResponse> {
    try {
      const response = await this.axiosInstance.get<any>(
        '/sos/incidents/',
        {
          params: {
            search: searchTerm,
            status: 'PENDING',
          },
        }
      );
      
      const incidents = this.extractIncidents(response.data);
      
      return {
        success: true,
        message: 'Incidents retrieved successfully',
        data: incidents,
        count: response.data.count,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all disaster types
   */
  getDisasterTypes() {
    return {
      fire: { label: 'Fire', emoji: '🔥', color: '#ef4444' },
      accident: { label: 'Accident', emoji: '🚗', color: '#f97316' },
      landslide: { label: 'Landslide', emoji: '⛏️', color: '#eab308' },
      flood: { label: 'Flood', emoji: '🌊', color: '#3b82f6' },
      earthquake: { label: 'Earthquake', emoji: '🌍', color: '#8b5cf6' },
    };
  }

  /**
   * Handle errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      return new Error(message);
    }
    return new Error('An unexpected error occurred');
  }
}

// Export singleton instance
export const incidentAPI = new IncidentAPIService();
export default incidentAPI;