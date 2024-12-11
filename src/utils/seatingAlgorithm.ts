import { Student, Seat, SeatHistory } from '../types';

interface StudentHistory {
  [studentId: string]: {
    previousNeighbors: Set<string>;
    previousRows: Set<number>;
  };
}

export function generateOptimalSeating(
  students: Student[],
  seats: Seat[],
  history: SeatHistory[]
): { [seatId: string]: string } {
  // Build history data for each student
  const studentHistory: StudentHistory = {};
  
  students.forEach((student) => {
    studentHistory[student.id] = {
      previousNeighbors: new Set(),
      previousRows: new Set(),
    };
  });

  // Populate history data
  history.forEach((arrangement) => {
    arrangement.assignments.forEach((assignment) => {
      const student = studentHistory[assignment.studentId];
      if (student) {
        assignment.neighbors.forEach((neighborId) => {
          student.previousNeighbors.add(neighborId);
        });
        student.previousRows.add(assignment.row);
      }
    });
  });

  // Score function for a potential seat assignment
  const scoreAssignment = (
    studentId: string,
    seat: Seat,
    currentAssignments: { [seatId: string]: string }
  ): number => {
    let score = 0;
    const student = studentHistory[studentId];

    // Check neighbors in current arrangement
    const neighbors = seats.filter(
      (s) =>
        s.row === seat.row && Math.abs(s.column - seat.column) === 1
    );

    neighbors.forEach((neighbor) => {
      const neighborStudentId = currentAssignments[neighbor.id];
      if (neighborStudentId && student.previousNeighbors.has(neighborStudentId)) {
        score -= 10; // Heavy penalty for previous neighbors
      }
    });

    if (student.previousRows.has(seat.row)) {
      score -= 5; // Penalty for same row
    }

    return score;
  };

  // Generate new seating arrangement
  const assignments: { [seatId: string]: string } = {};
  const availableStudents = [...students];
  
  // Sort seats by row and column for consistent assignment
  const sortedSeats = [...seats].sort((a, b) => 
    a.row === b.row ? a.column - b.column : a.row - b.row
  );

  sortedSeats.forEach((seat) => {
    if (availableStudents.length === 0) return;

    // Find best student for this seat
    let bestScore = -Infinity;
    let bestStudentIndex = 0;

    availableStudents.forEach((student, index) => {
      const score = scoreAssignment(student.id, seat, assignments);
      if (score > bestScore) {
        bestScore = score;
        bestStudentIndex = index;
      }
    });

    // Assign the best student to this seat
    const [student] = availableStudents.splice(bestStudentIndex, 1);
    assignments[seat.id] = student.id;
  });

  return assignments;
}