import React, { useState } from 'react';
import { useSeatingStore } from '../store/useSeatingStore';
import { UserPlus } from 'lucide-react';
import { CSVUpload } from './CSVUpload';

export function StudentList() {
  const { students, addStudent, removeStudent } = useSeatingStore();
  const [newStudentName, setNewStudentName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      addStudent(newStudentName.trim());
      setNewStudentName('');
    }
  };

  const handleDragStart = (e: React.DragEvent, studentId: string) => {
    e.dataTransfer.setData('text/plain', studentId);
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Students</h2>
      
      <CSVUpload />
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Add new student"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <UserPlus size={20} />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {students.map((student) => (
          <div
            key={student.id}
            draggable
            onDragStart={(e) => handleDragStart(e, student.id)}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <span>{student.name}</span>
            <button
              onClick={() => removeStudent(student.id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}