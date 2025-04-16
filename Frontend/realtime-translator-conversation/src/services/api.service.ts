import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = 'https://localhost:7071/api';
// const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7071/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add request interceptor for authentication if needed
    this.api.interceptors.request.use(
      (config) => {
        // You can add auth tokens here if needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Generic GET method
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  // Generic POST method
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  // Method for sending binary data (audio)
  public async postBinary<T>(url: string, data: Blob | ArrayBuffer, language: string): Promise<T> {
    try {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'X-Language': language
      };

      const response = await this.api.post<T>(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('API Binary POST Error:', error);
      throw error;
    }
  }

  // Get audio file from the API (for text-to-speech)
  public async getAudioBlob(url: string, data: any): Promise<Blob> {
    try {
      const response = await this.api.post(url, data, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('API Audio GET Error:', error);
      throw error;
    }
  }
}

// Export as singleton
export default new ApiService();