import type { Team } from '../api/interfaces';

export interface MenuItem {
  routeName: string;
  icon: Object;
  text: string;
  title: string;
  type?: string;
  divider?: boolean;
  requireAdmin?: boolean;
}

export interface TeamWithAttachmentStatus extends Team {
  medcertUploaded: boolean;
  paymentUploaded: boolean;
}
