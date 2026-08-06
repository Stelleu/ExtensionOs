export interface BookedAppointment {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  serviceId: string;
}

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

export interface BookingState {
  serviceId: string | null;
  date: string | null;
  time: string | null;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export const WORKING_DAYS = [2, 3, 4, 5, 6]; // Tue–Sat
export const DAY_START = 10; // 10:00
export const DAY_END = 18; // 18:00
export const SLOT_INTERVAL = 30; // minutes
