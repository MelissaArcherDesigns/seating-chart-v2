import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Seat, SeatHistory } from '../types';
import { generateOptimalSeating } from '../utils/seatingAlgorithm';

interface SeatingStore {
  students: Student[];
  seats: Seat[];
  seatHistory: SeatHistory[];
  addStudent: (name: string) => void;
  removeStudent: (id: string) => void;
  addSeat: (row: number, column: number) => void;
  removeSeat: (id: string) => void;
  moveSeat: (seatId: string, newRow: number, newColumn: number) => void;
  assignStudent: (studentId: string, seatId: string) => void;
  regenerateSeating: () => void;
  saveCurrentArrangement: () => void;
  clearAllAssignments: () => void;
}

export const useSeatingStore = create<SeatingStore>()(
  persist(
    (set, get) => ({
      students: [],
      seats: [],
      seatHistory: [],

      addStudent: (name: string) => {
        set((state) => ({
          students: [...state.students, { id: crypto.randomUUID(), name }],
        }));
      },

      removeStudent: (id: string) => {
        set((state) => ({
          students: state.students.filter((student) => student.id !== id),
          seats: state.seats.map((seat) =>
            seat.studentId === id ? { ...seat, studentId: null } : seat
          ),
        }));
      },

      addSeat: (row: number, column: number) => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const seatCount = get().seats.length;
        const label = alphabet[seatCount % alphabet.length];
        
        set((state) => ({
          seats: [
            ...state.seats,
            {
              id: crypto.randomUUID(),
              label,
              studentId: null,
              row,
              column,
            },
          ],
        }));
      },

      removeSeat: (id: string) => {
        set((state) => ({
          seats: state.seats.filter((seat) => seat.id !== id),
        }));
      },

      moveSeat: (seatId: string, newRow: number, newColumn: number) => {
        set((state) => ({
          seats: state.seats.map((seat) =>
            seat.id === seatId
              ? { ...seat, row: newRow, column: newColumn }
              : seat
          ),
        }));
      },

      assignStudent: (studentId: string, seatId: string) => {
        set((state) => ({
          seats: state.seats.map((seat) =>
            seat.id === seatId ? { ...seat, studentId } : seat
          ),
        }));
      },

      clearAllAssignments: () => {
        set((state) => ({
          seats: state.seats.map((seat) => ({ ...seat, studentId: null })),
        }));
      },

      regenerateSeating: () => {
        const { students, seats, seatHistory } = get();
        
        // Clear existing assignments first
        get().clearAllAssignments();
        
        // Generate new assignments
        const newAssignments = generateOptimalSeating(students, seats, seatHistory);
        
        set((state) => ({
          seats: state.seats.map((seat) => ({
            ...seat,
            studentId: newAssignments[seat.id] || null,
          })),
        }));
      },

      saveCurrentArrangement: () => {
        const { seats, students } = get();
        const currentAssignment: SeatHistory = {
          date: new Date().toISOString(),
          assignments: seats
            .filter((seat) => seat.studentId)
            .map((seat) => ({
              studentId: seat.studentId!,
              seatId: seat.id,
              row: seat.row,
              neighbors: seats
                .filter((s) => 
                  s.studentId &&
                  s.row === seat.row &&
                  Math.abs(s.column - seat.column) === 1
                )
                .map((s) => s.studentId!)
            })),
        };

        set((state) => ({
          seatHistory: [...state.seatHistory, currentAssignment],
        }));
      },
    }),
    {
      name: 'seating-storage',
    }
  )
);