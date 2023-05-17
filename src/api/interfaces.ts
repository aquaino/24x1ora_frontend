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

export interface Runner {
  id: number | null;
  first_name: string;
  last_name: string;
  member_iuta: boolean | number;
  member_csm: boolean | number;
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

export interface TeamData {
  name: string;
  manager: string;
  manager_cell: string;
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
  attachments: string[];
  payment_code: string;
  type: RaceType;
  runners: Runner[];
}

export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  id: number;
  updated_at: string;
  created_at: string;
  email_verified_at: string | null;
  access?: string;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
}

export interface UserInputWihtConfirmPassword extends UserInput {
  confirmPassword: string;
}

export interface LoginData {
  status: boolean;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterData {
  status: boolean;
  user: User;
}
