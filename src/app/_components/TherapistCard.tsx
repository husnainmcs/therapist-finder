import React from 'react';
import {MapPin, Clock, DollarSign} from 'lucide-react';
import type { Therapist } from "@/types/sharedTypes";


interface TherapistCardProps {
 therapist: Therapist;
 onClick: () => void;
}

export const TherapistCard: React.FC<TherapistCardProps> = ({
 therapist,
 onClick,
}) => {
 return (
  <div
   className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600"
   onClick={onClick}
  >
   {/* Header */}
   <div className="flex items-start justify-between mb-4">
    <div>
     <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 transition-colors duration-300">
      {therapist.name}
     </h3>
     <p className="text-sm text-gray-600 dark:text-gray-300 capitalize transition-colors duration-300">
      {therapist.gender.toLowerCase()} • {therapist.experience_years || 0} years
      exp.
     </p>
    </div>
    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center transition-colors duration-300">
     <span className="text-teal-600 dark:text-teal-300 font-semibold text-sm transition-colors duration-300">
      {therapist.name
       .split(' ')
       .map((n) => n[0])
       .join('')}
     </span>
    </div>
   </div>

   {/* Details */}
   <div className="space-y-3 mb-4">
    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
     <MapPin className="w-4 h-4 mr-2 text-teal-500" />
     <span>{therapist.city}</span>
    </div>

    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
     <Clock className="w-4 h-4 mr-2 text-teal-500" />
     <span>{therapist.experience_years || 0} years experience</span>
    </div>

    <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300">
     <DollarSign className="w-4 h-4 mr-2 text-green-500" />
     <span>Rs. {therapist.fee_amount?.toLocaleString() || 'N/A'}</span>
    </div>
   </div>

   {/* Expertise Preview */}
   {therapist.expertise && (
    <div className="mb-4">
     <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
      {therapist.expertise.split(';').slice(0, 2).join(' • ')}
     </p>
    </div>
   )}

   {/* Action Button */}
   <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium hover:shadow-md">
    View Details
   </button>
  </div>
 );
};
