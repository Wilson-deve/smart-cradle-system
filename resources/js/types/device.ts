export interface DeviceSettings {
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
}

export interface DeviceUser {
  id: number;
  name: string;
  email: string;
  pivot: {
    relationship_type: 'owner' | 'caretaker' | 'viewer';
    permissions: string[];
  };
}

export interface Device {
  id: number;
  name: string;
  serial_number: string;
  mac_address: string;
  ip_address: string | null;
  status: 'online' | 'offline' | 'maintenance';
  settings: DeviceSettings;
  battery_level?: number;
  signal_strength?: number;
  last_activity_at: string;
  last_maintenance_at?: string;
  next_maintenance_at?: string;
  users: DeviceUser[];
  users_count?: number;
  owner?: DeviceUser;
}

export interface DeviceFormData {
  name: string;
  serial_number: string;
  mac_address: string;
  ip_address?: string;
  settings?: Partial<DeviceSettings>;
}

export interface DeviceValidation {
  name: string[];
  serial_number: string[];
  mac_address: string[];
  ip_address?: string[];
}

// Utility type for device update operations
export type DeviceUpdateData = Partial<Omit<Device, 'id' | 'users' | 'owner'>>;

// Regular expressions for validation
export const MAC_ADDRESS_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
export const IP_ADDRESS_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
