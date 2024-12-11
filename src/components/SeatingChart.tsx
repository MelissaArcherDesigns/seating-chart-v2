import React from 'react';
import { useSeatingStore } from '../store/useSeatingStore';
import { Seat } from './Seat';
import { Plus, Save } from 'lucide-react';
import { RegenerateSeatingDialog } from './RegenerateSeatingDialog';

export function SeatingChart() {
  const { seats, addSeat, saveCurrentArrangement } = useSeatingStore();

  const handleAddSeat = (row: number, column: number) => {
    addSeat(row, column);
  };

  // Get the maximum row and column numbers
  const maxRow = Math.max(...seats.map((seat) => seat.row), 0);
  const maxColumn = Math.max(...seats.map((seat) => seat.column), 0);

  // Create a grid representation
  const grid: (string | null)[][] = Array(maxRow + 2)
    .fill(null)
    .map(() => Array(maxColumn + 2).fill(null));

  // Fill the grid with seat IDs
  seats.forEach((seat) => {
    grid[seat.row][seat.column] = seat.id;
  });

  return (
    <div className="flex-1 p-4">
      <div className="mb-4 flex gap-4">
        <RegenerateSeatingDialog />
        <button
          onClick={saveCurrentArrangement}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <Save size={20} />
          Save Arrangement
        </button>
      </div>

      <div className="inline-block border rounded-lg p-4 bg-gray-50">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((seatId, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="relative">
                {seatId ? (
                  <Seat {...seats.find((s) => s.id === seatId)!} />
                ) : (
                  <button
                    onClick={() => handleAddSeat(rowIndex, colIndex)}
                    className="w-32 h-32 m-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500"
                  >
                    <Plus size={24} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}