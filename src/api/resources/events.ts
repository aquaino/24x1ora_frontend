import apiClient from '../client';

export interface Event {
  id: number;
  name: string;
  date: string;
  visible_from: string | null;
  visible_to: string | null;
  subscription_from: string | null;
  subscription_to: string | null;
  edit_end: string | null;
  start_hour: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

const resource = '/events';

export const eventsApi = {
  async get(): Promise<any> {
    const response = await apiClient.get(`${resource}`).catch((error) => {
      throw error;
    });
    return response.data.events;
  },
};
