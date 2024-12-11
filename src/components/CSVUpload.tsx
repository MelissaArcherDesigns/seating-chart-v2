import React, { useRef, useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { useSeatingStore } from '../store/useSeatingStore';

export function CSVUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addStudent, regenerateSeating, seats } = useSeatingStore();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const studentNames = parseCSV(content);
      
      // Add all students first
      studentNames.forEach(name => addStudent(name));

      // If we have seats, generate the seating arrangement
      if (seats.length > 0) {
        setTimeout(() => {
          regenerateSeating();
          setIsLoading(false);
        }, 500);
      } else {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-upload"
        disabled={isLoading}
      />
      <label
        htmlFor="csv-upload"
        className={`flex items-center gap-2 px-4 py-2 ${
          isLoading 
            ? 'bg-gray-200 cursor-not-allowed' 
            : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
        } text-gray-700 rounded-md`}
      >
        {isLoading ? (
          <>
            <Loader className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          <>
            <Upload size={20} />
            Import CSV
          </>
        )}
      </label>
      <p className="text-xs text-gray-500 mt-1">
        Upload a CSV file with student names in the first column
        {seats.length === 0 && (
          <span className="block text-amber-500">
            Add seats to enable automatic assignment
          </span>
        )}
      </p>
    </div>
  );
}