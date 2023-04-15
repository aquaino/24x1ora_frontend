import apiClient from '../client';
import type { Runner } from './teams';

const resource = 'events';

export interface RaceEvent {
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

export interface RaceEventDetails extends RaceEvent {
  races: Race[];
}

export interface Race {
  id: number;
  event_id: number;
  race_bib: number;
  created_at: string;
  updated_at: string;
  price: string;
  available_discount: string;
  deposit: string;
  type: RaceType;
}

export interface RaceType {
  id: number;
  name: string;
  start_offset: number;
  duration: number;
  runners_per_team: number;
  race_bib: number;
  class: string;
  created_at: string;
  updated_at: string;
}

export const eventsApi = {
  async getEventDetails(id: number): Promise<RaceEventDetails> {
    const response = await apiClient.get(`/${resource}/${id}`).catch((error) => {
      throw error;
    });
    return response.data.event;
  },

  async getEvents(): Promise<RaceEvent[]> {
    const response = await apiClient.get(`/${resource}`).catch((error) => {
      throw error;
    });
    return response.data.events;
  },

  async subscribeIndividual(eventId: number, raceId: number, runner: Runner) {
    await apiClient
      .post(`/${resource}/${eventId}/races/${raceId}/teams`, {
        runner: runner,
      })
      .catch((error) => {
        throw error;
      });
  },
};
