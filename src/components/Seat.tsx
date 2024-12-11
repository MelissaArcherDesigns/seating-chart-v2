import React from 'react';
import { useSeatingStore } from '../store/useSeatingStore';
import { Student } from '../types';

interface SeatProps {
  id: string;
  label: string;
  studentId: string | null;
  row: number;
  column: number;
}

export function Seat({ id, label, studentId, row, column }: SeatProps) {
  const { students, assignStudent, removeSeat } = useSeatingStore();
  
  const student = students.find((s) => s.id === studentId);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedStudentId = e.dataTransfer.getData('text/plain');
    assignStudent(droppedStudentId, id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="relative w-32 h-32 bg-white rounded-lg shadow-md m-2 flex flex-col items-center justify-center"
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <button
        onClick={() => removeSeat(id)}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
      >
        ×
      </button>
      <span className="text-sm text-gray-500">Seat {label}</span>
      {student ? (
        <span className="font-medium text-center mt-2">{student.name}</span>
      ) : (
        <span className="text-gray-400 italic">Empty</span>
      )}
      <span className="text-xs text-gray-400 mt-1">
        Row {row}, Col {column}
      </span>
    </div>
  );
}