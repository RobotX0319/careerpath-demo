import React from 'react';

// Career type definition
type Career = {
  id: string;
  title: string;
  description: string;
  averageSalary?: string;
  salary?: string;
  demandLevel?: 'low' | 'medium' | 'high';
  requiredSkills?: string[];
  skills?: string[];
  growthRate?: string;
  growth?: string;
  category?: string;
  matchScore?: number;
  companies?: string[];
};

interface CareerCardProps {
  career: Career;
  rank: number;
  onViewDetails: (career: Career) => void;
}

const getMatchColor = (score?: number) => {
  if (score === undefined) return 'bg-gray-300 text-gray-700';
  if (score >= 80) return 'bg-green-500 text-white';
  if (score >= 60) return 'bg-yellow-400 text-gray-900';
  return 'bg-orange-400 text-white';
};

export const CareerCard: React.FC<CareerCardProps> = ({ career, rank, onViewDetails }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col gap-4 relative cursor-pointer hover:-translate-y-1"
    >
      {/* Rank badge */}
      <div className="absolute -top-4 -left-4">
        <span className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold shadow-md border-4 border-white ${getMatchColor(career.matchScore)}`}>
          {rank}
        </span>
      </div>
      {/* Title & Match */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{career.title}</h2>
        <span className={`px-3 py-1 rounded-full text-base font-semibold shadow-sm ${getMatchColor(career.matchScore)}`}>
          {career.matchScore ? `${career.matchScore}%` : '--'}
        </span>
      </div>
      {/* Info grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 mt-2">
        <div>
          <span className="font-semibold">Maosh:</span> {career.salary}
        </div>
        <div>
          <span className="font-semibold">O'sish:</span> {career.growth}
        </div>
        <div className="col-span-2 md:col-span-1">
          <span className="font-semibold">Kompaniyalar:</span> {career.companies?.slice(0,2).join(', ') || 'Ma\'lumot yo\'q'}
        </div>
      </div>
      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(career.skills && career.skills.length > 0) ? career.skills.slice(0, 3).map(skill => (
          <span 
            key={skill}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
          >
            {skill}
          </span>
        )) : (
          <span className="text-gray-500 text-sm">Ko'nikmalar ma'lumoti yo'q</span>
        )}
      </div>
      {/* Button */}
      <button
        className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-base shadow hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => onViewDetails(career)}
      >
        Batafsil Ma'lumot
      </button>
    </div>
  );
};

export default CareerCard;
