import React from 'react';
import { StudentList } from './components/StudentList';
import { SeatingChart } from './components/SeatingChart';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Classroom Seating Chart</h1>
      
      <div className="flex gap-8">
        <StudentList />
        <SeatingChart />
      </div>
    </div>
  );
}

export default App;