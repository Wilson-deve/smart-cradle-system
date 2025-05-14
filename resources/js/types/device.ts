export interface Device {
  id: number;
  name: string;
  serial_number: string;
  mac_address: string;
  ip_address: string | null;
  status: 'online' | 'offline' | 'maintenance';
  settings: {
    swing?: {
      enabled: boolean;
      speed?: number;
    };
    music?: {
      enabled: boolean;
      volume?: number;
      track_id?: number;
    };
    projector?: {
      enabled: boolean;
      brightness?: number;
      pattern?: string;
    };
    camera?: {
      stream_url: string | null;
      status: 'online' | 'offline';
      night_vision: boolean;
    };
  };
  battery_level?: number;
  signal_strength?: number;
  last_activity_at: string;
  last_maintenance_at?: string;
  next_maintenance_at?: string;
  users: Array<{
    id: number;
    name: string;
    email: string;
    pivot: {
      relationship_type: 'owner' | 'caretaker' | 'viewer';
      permissions: string[];
    };
  }>;
}
