import apiClient from '../client';

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

export interface Team {
  id: number;
  event_id: number;
  race_type_id: number;
  user_id: number;
  name: string;
  number: number;
  manager: string;
  manager_cell: string;
  confirmed: number;
  created_at: string;
  updated_at: string;
  payment_confirmed: number;
  price: string;
  discount: string;
  deposit: string;
  attachments: [];
  payment_code: string;
  type: RaceType;
}

export interface Runner {
  first_name: string;
  last_name: string;
  member_iuta: boolean;
  member_csm: boolean;
  fidal_id: string;
  csi_id: string;
  other_id: string;
  birth_date: string;
}

export interface SubscriptionData {
  status: boolean;
  event: RaceEvent;
  team: Team;
}

const resource = '/events';

export const eventsApi = {
  async get(id?: number): Promise<RaceEvent | RaceEvent[]> {
    if (typeof id !== 'undefined') {
      const response = await apiClient.get(`${resource}/${id}`).catch((error) => {
        throw error;
      });
      return response.data.event;
    } else {
      const response = await apiClient.get(`${resource}`).catch((error) => {
        throw error;
      });
      return response.data.events;
    }
  },

  async subscribe(eventId: number, raceId: number, runner: Runner): Promise<SubscriptionData> {
    const response = await apiClient
      .post(`${resource}/${eventId}/races/${raceId}/teams`, {
        runner: runner,
      })
      .catch((error) => {
        throw error;
      });
    return response.data;
  },

  async getTeams(id: number): Promise<{ event: RaceEvent; teams: Team[] }> {
    const response = await apiClient.get(`${resource}/${id}/teams`).catch((error) => {
      throw error;
    });
    const event = response.data.event;
    const teams = response.data.teams;
    return { event, teams };
  },
};
