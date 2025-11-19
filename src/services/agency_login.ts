import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  admin: {
    id: number;
    username: string;
    email: string;
    agency_type: string;
    created_at: string;
  };
}

interface AuthState {
  token: string | null;
  admin: LoginResponse['admin'] | null;
  isAuthenticated: boolean;
}

class AgencyLoginService {
  // Correct paths based on main urls.py: path('agency/', include('agency.urls'))
  private readonly LOGIN_URL = `${API_BASE_URL}/agency/agency-admin/login/`;
  private readonly DASHBOARD_URL = `${API_BASE_URL}/agency/agency-admin/dashboard/`;
  private readonly LOGOUT_URL = `${API_BASE_URL}/agency/api/auth/logout/`;

  /**
   * Login agency admin with username and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        this.LOGIN_URL,
        {
          username: credentials.username,
          password: credentials.password,
        }
      );

      // Store token and admin info
      if (response.data.token) {
        localStorage.setItem('agencyToken', response.data.token);
        localStorage.setItem('agencyAdmin', JSON.stringify(response.data.admin));
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.detail ||
                           error.message ||
                           'Login failed. Please try again.';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Get current logged-in agency admin details
   */
  async getAgencyAdminDetails(): Promise<LoginResponse['admin']> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get<LoginResponse['admin']>(
        this.DASHBOARD_URL,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || 'Failed to fetch admin details'
        );
      }
      throw error;
    }
  }

  /**
   * Logout agency admin
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await axios.post(
          this.LOGOUT_URL,
          {},
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of request success
      localStorage.removeItem('agencyToken');
      localStorage.removeItem('agencyAdmin');
    }
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('agencyToken');
  }

  /**
   * Get stored admin details
   */
  getStoredAdmin(): LoginResponse['admin'] | null {
    const admin = localStorage.getItem('agencyAdmin');
    return admin ? JSON.parse(admin) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get auth header for API requests
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Token ${token}` } : {};
  }
}

export default new AgencyLoginService();
export type { LoginCredentials, LoginResponse, AuthState };