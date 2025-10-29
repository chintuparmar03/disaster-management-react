import axios, { AxiosInstance } from 'axios';

interface IncidentLocation {
  id: number;
  disaster_type: string;
  full_address: string;
  pincode: string;
  latitude: number;
  longitude: number;
  citizen_name: string;
  citizen_phone: string;
  reported_time: string;
  status: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface IncidentsResponse {
  data: IncidentLocation[];
  total: number;
  message: string;
}

class IncidentService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('auth_token');
          }
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch all active incidents
   */
  async getActiveIncidents(): Promise<ApiResponse<IncidentLocation[]>> {
    try {
      const response = await this.api.get<IncidentsResponse>('/incidents/active');
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch incidents by disaster type
   */
  async getIncidentsByType(disasterType: string): Promise<ApiResponse<IncidentLocation[]>> {
    try {
      const response = await this.api.get<IncidentsResponse>(
        `/incidents/type/${disasterType}`
      );
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch a single incident by ID
   */
  async getIncidentById(id: number): Promise<ApiResponse<IncidentLocation>> {
    try {
      const response = await this.api.get<{ data: IncidentLocation }>(
        `/incidents/${id}`
      );
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new incident
   */
  async createIncident(
    incidentData: Omit<IncidentLocation, 'id' | 'reported_time'>
  ): Promise<ApiResponse<IncidentLocation>> {
    try {
      const response = await this.api.post<{ data: IncidentLocation }>(
        '/incidents',
        incidentData
      );
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update incident status
   */
  async updateIncidentStatus(
    id: number,
    status: string
  ): Promise<ApiResponse<IncidentLocation>> {
    try {
      const response = await this.api.patch<{ data: IncidentLocation }>(
        `/incidents/${id}/status`,
        { status }
      );
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Search incidents by name or address
   */
  async searchIncidents(query: string): Promise<ApiResponse<IncidentLocation[]>> {
    try {
      const response = await this.api.get<IncidentsResponse>('/incidents/search', {
        params: { q: query },
      });
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get incidents within a geographic radius
   */
  async getIncidentsByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<ApiResponse<IncidentLocation[]>> {
    try {
      const response = await this.api.get<IncidentsResponse>('/incidents/nearby', {
        params: { latitude, longitude, radius: radiusKm },
      });
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Assign volunteers to an incident
   */
  async assignVolunteers(
    incidentId: number,
    volunteerIds: number[]
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response = await this.api.post<{ data: { success: boolean } }>(
        `/incidents/${incidentId}/assign-volunteers`,
        { volunteerIds }
      );
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Send alert for an incident
   */
  async sendAlert(
    incidentId: number,
    message: string,
    recipientType: 'all' | 'volunteers' | 'citizens'
  ): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response = await this.api.post<{ data: { success: boolean } }>(
        `/incidents/${incidentId}/send-alert`,
        { message, recipientType }
      );
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete an incident
   */
  async deleteIncident(id: number): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const response = await this.api.delete<{ data: { success: boolean } }>(
        `/incidents/${id}`
      );
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || `Error: ${error.response.status}`;
      return new Error(message);
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
      return new Error(error.message || 'An unknown error occurred');
    }
  }
}

export const incidentService = new IncidentService();

// Named exports for convenience
export const getActiveIncidents = () => incidentService.getActiveIncidents();
export const getIncidentsByType = (disasterType: string) => 
  incidentService.getIncidentsByType(disasterType);
export const getIncidentById = (id: number) => incidentService.getIncidentById(id);
export const createIncident = (incidentData: Omit<IncidentLocation, 'id' | 'reported_time'>) => 
  incidentService.createIncident(incidentData);
export const updateIncidentStatus = (id: number, status: string) => 
  incidentService.updateIncidentStatus(id, status);
export const searchIncidents = (query: string) => incidentService.searchIncidents(query);
export const getIncidentsByLocation = (latitude: number, longitude: number, radiusKm?: number) => 
  incidentService.getIncidentsByLocation(latitude, longitude, radiusKm);
export const assignVolunteers = (incidentId: number, volunteerIds: number[]) => 
  incidentService.assignVolunteers(incidentId, volunteerIds);
export const sendAlert = (incidentId: number, message: string, recipientType: 'all' | 'volunteers' | 'citizens') => 
  incidentService.sendAlert(incidentId, message, recipientType);
export const deleteIncident = (id: number) => incidentService.deleteIncident(id);