import type { BookedAppointment } from "@/types/booking";

export const mockBookedAppointments: BookedAppointment[] = [
  { date: "2026-08-05", time: "10:00", durationMinutes: 180, serviceId: "tape-in" },
  { date: "2026-08-05", time: "14:00", durationMinutes: 120, serviceId: "maintenance" },
  { date: "2026-08-06", time: "11:00", durationMinutes: 240, serviceId: "sew-in" },
  { date: "2026-08-07", time: "10:30", durationMinutes: 300, serviceId: "microlink" },
  { date: "2026-08-08", time: "13:00", durationMinutes: 180, serviceId: "tape-in" },
  { date: "2026-08-12", time: "10:00", durationMinutes: 120, serviceId: "maintenance" },
  { date: "2026-08-12", time: "15:00", durationMinutes: 180, serviceId: "tape-in" },
];
