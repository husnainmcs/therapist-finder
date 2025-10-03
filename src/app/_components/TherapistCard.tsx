import React from "react";
import { MapPin, Clock, DollarSign } from "lucide-react";

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
      className="cursor-pointer rounded-lg border border-gray-100 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">
            {therapist.name}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            {therapist.gender.toLowerCase()} • {therapist.experience_years || 0}{" "}
            years exp.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
          <span className="text-sm font-semibold text-teal-600">
            {therapist.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="mr-2 h-4 w-4 text-teal-500" />
          <span>{therapist.city}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="mr-2 h-4 w-4 text-teal-500" />
          <span>{therapist.experience_years || 0} years experience</span>
        </div>

        <div className="flex items-center text-sm font-semibold text-gray-900">
          <DollarSign className="mr-2 h-4 w-4 text-green-500" />
          <span>Rs. {therapist.fee_amount?.toLocaleString() || "N/A"}</span>
        </div>
      </div>

      {/* Expertise Preview */}
      {therapist.expertise && (
        <div className="mb-4">
          <p className="line-clamp-2 text-xs text-gray-500">
            {therapist.expertise.split(";").slice(0, 2).join(" • ")}
          </p>
        </div>
      )}

      {/* Action Button */}
      <button className="w-full rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600">
        View Details
      </button>
    </div>
  );
};
