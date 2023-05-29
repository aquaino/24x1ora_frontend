import apiClient from './client';
import axios from 'axios';
import type {
  RaceEventDetails,
  RaceEvent,
  Team,
  RunnerUpdate,
  Runner,
  LoginData,
  RegisterData,
  UserInputWihtConfirmPassword,
  User,
  UserInput,
  TeamData,
} from './interfaces';

export const eventsApi = {
  async getEventDetails(id: number): Promise<RaceEventDetails> {
    const response = await apiClient.get(`/events/${id}`).catch((error) => {
      throw error;
    });
    return response.data.event;
  },

  async getEvents(): Promise<RaceEvent[]> {
    const response = await apiClient.get(`/events`).catch((error) => {
      throw error;
    });
    return response.data.events;
  },
};

export const teamsApi = {
  async getEventTeams(eventId: number): Promise<{
    event: RaceEvent;
    teams: Team[];
  }> {
    const response = await apiClient.get(`events/${eventId}/teams`).catch((error) => {
      throw error;
    });
    const event = response.data.event;
    const teams = response.data.teams;
    return { event, teams };
  },

  async getEventTeamDetails(
    eventId: number,
    teamId?: number,
  ): Promise<{
    event: RaceEvent;
    team: Team;
  }> {
    const response = await apiClient.get(`events/${eventId}/teams/${teamId}`).catch((error) => {
      throw error;
    });
    const event = response.data.event;
    const team = response.data.team;
    return { event, team };
  },

  async updateIndividualTeam(
    eventId: number,
    teamId: number,
    runnerData: RunnerUpdate,
  ): Promise<Runner> {
    const response = await apiClient
      .patch(`events/${eventId}/teams/${teamId}`, { runners: [runnerData] })
      .catch((error) => {
        throw error;
      });
    return response.data.team.runners[0];
  },

  async updateTeam(eventId: number, teamId: number, team: Team): Promise<Team> {
    const response = await apiClient
      .patch(`events/${eventId}/teams/${teamId}`, team)
      .catch((error) => {
        throw error;
      });
    return response.data.team;
  },

  async confirmTeam(eventId: number, teamId: number) {
    await apiClient.post(`events/${eventId}/teams/${teamId}/confirmPayment`).catch((error) => {
      throw error;
    });
  },

  async deleteTeam(eventId: number, teamId: number) {
    await apiClient.delete(`events/${eventId}/teams/${teamId}`).catch((error) => {
      throw error;
    });
  },

  async getAttachmentFile(eventId: number, teamId: number, fileName: string): Promise<MediaSource> {
    const response = await apiClient
      .get(`/events/${eventId}/teams/${teamId}/attachments/${fileName}`, { responseType: 'blob' })
      .catch((error) => {
        throw error;
      });
    return response.data;
  },

  async createIndividualRaceRegistration(
    eventId: number,
    raceId: number,
    runner: Runner,
  ): Promise<Team> {
    const response = await apiClient
      .post(`/events/${eventId}/races/${raceId}/teams`, {
        runner: runner,
      })
      .catch((error) => {
        throw error;
      });
    return response.data.team;
  },

  async createTeamRaceRegistration(
    eventId: number,
    raceId: number,
    teamData: TeamData,
  ): Promise<Team> {
    const response = await apiClient
      .post(`/events/${eventId}/races/${raceId}/teams`, teamData)
      .catch((error) => {
        throw error;
      });
    return response.data.team;
  },
};

export const usersApi = {
  async login(email: string, password: string): Promise<LoginData> {
    const response = await apiClient
      .post('/auth/login', {
        email: email,
        password: password,
      })
      .catch((error) => {
        throw error;
      });
    return response.data;
  },

  async register(user: UserInput | UserInputWihtConfirmPassword): Promise<RegisterData> {
    const response = await apiClient
      .post(`/users/register`, {
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .catch((error) => {
        throw error;
      });
    return response.data;
  },

  async verifyEmail(token: string): Promise<void> {
    const response = await axios
      .post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/email-verify`, null, {
        params: { token: token },
      })
      .catch((error) => {
        throw error;
      });
    return response.data;
  },

  async getProfileDetails(): Promise<User> {
    const response = await apiClient.get(`/users/profile`).catch((error) => {
      throw error;
    });
    return response.data.user;
  },

  async getUsers(): Promise<User[]> {
    const response = await apiClient.get(`/users`).catch((error) => {
      throw error;
    });
    return response.data.users;
  },
};
