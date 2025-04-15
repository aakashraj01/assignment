import { GlobeAltIcon } from '@heroicons/react/24/solid';

const DestinationClue = ({ clue }) => {
  // Simple check if clue is an array (for multiple clues) or string
  const clues = Array.isArray(clue) ? clue : [clue]; 

  return (
    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
      <div className="flex items-center text-blue-600 mb-5">
        <GlobeAltIcon className="h-6 w-6 mr-2 flex-shrink-0" />
        <h2 className="text-xl font-semibold">Where is this place?</h2>
      </div>
      
      <div className="space-y-4">
        {clues.map((c, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-start">
              <span className="text-blue-600 font-medium mr-3">Clue {index + 1}:</span>
              <p className="text-gray-700 flex-1 italic">{c}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationClue; 