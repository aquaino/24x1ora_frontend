import apiClient from '../client';
import type { Runner, Team } from './teams';

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
  races: Race[];
  created_at: string;
  updated_at: string;
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

export interface SubscriptionData {
  status: boolean;
  event: RaceEvent;
  team: Team;
}

export const eventsApi = {
  async get(id?: number): Promise<RaceEvent | RaceEvent[]> {
    if (typeof id !== 'undefined') {
      const response = await apiClient.get(`/${resource}/${id}`).catch((error) => {
        throw error;
      });
      return response.data.event;
    } else {
      const response = await apiClient.get(`/${resource}`).catch((error) => {
        throw error;
      });
      return response.data.events;
    }
  },

  async subscribe(eventId: number, raceId: number, runner: Runner): Promise<SubscriptionData> {
    const response = await apiClient
      .post(`/${resource}/${eventId}/races/${raceId}/teams`, {
        runner: runner,
      })
      .catch((error) => {
        throw error;
      });
    return response.data;
  },
};
