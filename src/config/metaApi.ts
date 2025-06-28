export interface MetaApiConfig {
  wabaId: string;
  accessToken: string;
  baseUrl: string;
  apiVersion: string;
}

export const metaApiConfig: MetaApiConfig = {
  wabaId: '314510838411963',
  accessToken: 'EAAMFCYvYZBekBO9UueyCAFWE9e3kWOIWle4C15nQOcMRbd0iMtLEWmzStZCC7D0EmwWP4oYdXhwpW28TLysOYy67it8UWmwsbvjyiTV5sqR34yXRBFiJSqQZAmotycrGZAVrbsmxEQ9SZAfQZCwt6ghIo3LANGXbtCfrG5tvErVtuVaDJ14cFiivjLnSJBwQsR',
  baseUrl: 'https://graph.facebook.com',
  apiVersion: 'v21.0'
};

export const flowCategories = [
  'SIGN_UP',
  'SIGN_IN', 
  'APPOINTMENT_BOOKING',
  'LEAD_GENERATION',
  'CONTACT_US',
  'CUSTOMER_SUPPORT',
  'SURVEY',
  'OTHER'
] as const;

export type FlowCategory = typeof flowCategories[number];

export interface CreateFlowRequest {
  name: string;
  categories: FlowCategory[];
  flow_json: string;
  publish?: boolean;
}

export interface CreateFlowResponse {
  id: string;
  status: string;
  validation_errors?: Array<{
    error_type: string;
    message: string;
    line_number?: number;
    column?: number;
  }>;
}

export class MetaFlowsAPI {
  private config: MetaApiConfig;

  constructor(config: MetaApiConfig) {
    this.config = config;
  }

  async createFlow(flowData: CreateFlowRequest): Promise<CreateFlowResponse> {
    const url = `${this.config.baseUrl}/${this.config.apiVersion}/${this.config.wabaId}/flows`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flowData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Meta API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create flow:', error);
      throw error;
    }
  }

  async getFlow(flowId: string) {
    const url = `${this.config.baseUrl}/${this.config.apiVersion}/${flowId}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get flow: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get flow:', error);
      throw error;
    }
  }

  async updateFlow(flowId: string, flowData: Partial<CreateFlowRequest>) {
    const url = `${this.config.baseUrl}/${this.config.apiVersion}/${flowId}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flowData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Meta API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update flow:', error);
      throw error;
    }
  }

  async publishFlow(flowId: string) {
    const url = `${this.config.baseUrl}/${this.config.apiVersion}/${flowId}/publish`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Meta API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to publish flow:', error);
      throw error;
    }
  }
}

export const metaFlowsAPI = new MetaFlowsAPI(metaApiConfig);