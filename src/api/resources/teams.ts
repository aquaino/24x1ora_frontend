import apiClient from '../client';
import type { RaceEvent, RaceType } from './events';

const resource = 'teams';

export interface Runner {
  id: number | null;
  first_name: string;
  last_name: string;
  member_iuta: boolean;
  member_csm: boolean;
  fidal_id: string;
  csi_id: string;
  other_id: string;
  birth_date: string;
}

export interface RunnerUpdate extends Partial<Runner> {
  id: number;
  first_name: string;
  last_name: string;
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
  runners: Runner[];
}

export const teamsApi = {
  async get(eventId: number, teamId?: number) {
    if (typeof teamId !== 'undefined') {
      const response = await apiClient
        .get(`events/${eventId}/${resource}/${teamId}`)
        .catch((error) => {
          throw error;
        });
      const event: RaceEvent = response.data.event;
      const team: Team = response.data.team;
      return { event, team };
    } else {
      const response = await apiClient.get(`events/${eventId}/${resource}`).catch((error) => {
        throw error;
      });
      const event: RaceEvent = response.data.event;
      const teams: Team[] = response.data.teams;
      return { event, teams };
    }
  },

  async update(eventId: number, teamId: number, runnerData: RunnerUpdate) {
    await apiClient
      .patch(`events/${eventId}/${resource}/${teamId}`, { runners: [runnerData] })
      .catch((error) => {
        throw error;
      });
  },
};
