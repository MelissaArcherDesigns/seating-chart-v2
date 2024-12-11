import React, { useState } from 'react';
import { RotateCw, AlertTriangle } from 'lucide-react';
import { useSeatingStore } from '../store/useSeatingStore';

export function RegenerateSeatingDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { regenerateSeating, saveCurrentArrangement, students, seats } = useSeatingStore();

  const handleRegenerate = () => {
    if (students.length === 0 || seats.length === 0) {
      return;
    }

    setIsRegenerating(true);
    // Save current arrangement before generating new one
    saveCurrentArrangement();
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      regenerateSeating();
      setIsRegenerating(false);
      setIsOpen(false);
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={students.length === 0 || seats.length === 0}
      >
        <RotateCw size={20} />
        Regenerate Seating
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 text-amber-500 mb-4">
          <AlertTriangle size={24} />
          <h2 className="text-lg font-semibold">Regenerate Seating Chart</h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          This will create a new seating arrangement where:
          <ul className="list-disc ml-6 mt-2">
            <li>Students will sit next to different classmates</li>
            <li>Students will be placed in different rows when possible</li>
            <li>Previous seating history will be considered</li>
          </ul>
        </p>

        <p className="text-sm text-gray-500 mb-6">
          The current arrangement will be saved to history automatically.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isRegenerating ? (
              <>
                <RotateCw className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <RotateCw size={20} />
                Confirm Regenerate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}