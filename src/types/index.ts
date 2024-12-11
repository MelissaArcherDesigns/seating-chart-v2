export interface Student {
  id: string;
  name: string;
}

export interface Seat {
  id: string;
  label: string;
  studentId: string | null;
  row: number;
  column: number;
}

export interface SeatHistory {
  date: string;
  assignments: {
    studentId: string;
    seatId: string;
    row: number;
    neighbors: string[]; // student IDs of neighbors
  }[];
}