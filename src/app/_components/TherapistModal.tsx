import React from "react";
import { X, MapPin, Clock, DollarSign, Phone, Mail, Globe } from "lucide-react";
import { api } from "@/trpc/react";

interface TherapistModalProps {
  therapistId: string;
  onClose: () => void;
}

export const TherapistModal: React.FC<TherapistModalProps> = ({
  therapistId,
  onClose,
}) => {
  const { data: therapist, isLoading } = api.therapists.getById.useQuery(
    { id: therapistId },
    { enabled: !!therapistId },
  );

  if (!therapist && !isLoading) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const makePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const sendEmail = (email: string) => {
    window.open(`mailto:${email}`, "_self");
  };

  const openProfile = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={handleBackdropClick}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white transition-colors duration-300 dark:bg-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-500"></div>
          </div>
        ) : therapist ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-3 transition-colors duration-300 lg:p-6 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 transition-colors duration-300 lg:h-16 lg:w-16 dark:bg-teal-900">
                  <span className="text-lg font-semibold text-teal-600 transition-colors duration-300 dark:text-teal-300">
                    {therapist.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h2 className="text-1xl font-bold text-gray-900 transition-colors duration-300 lg:text-2xl dark:text-white">
                    {therapist.name}
                  </h2>
                  <p className="text-gray-600 capitalize transition-colors duration-300 dark:text-gray-300">
                    {therapist.gender.toLowerCase()} •{" "}
                    {therapist.experience_years || 0} years experience
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-6 w-6 text-gray-900 dark:text-white" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="space-y-6 p-6">
                {/* Contact Information Bar */}
                <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 transition-colors duration-300 md:grid-cols-2 lg:grid-cols-4 dark:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-teal-500" />
                    <span className="text-sm text-gray-700 transition-colors duration-300 dark:text-gray-300">
                      {therapist.city}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900 transition-colors duration-300 dark:text-white">
                      Rs. {therapist.fee_amount?.toLocaleString() || "N/A"}
                    </span>
                  </div>

                  {therapist.phone && (
                    <button
                      onClick={() => makePhoneCall(therapist.phone!)}
                      className="flex items-center space-x-2 text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Now</span>
                    </button>
                  )}

                  {therapist.email && (
                    <button
                      onClick={() => sendEmail(therapist.email!)}
                      className="flex items-center space-x-2 text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Send Email</span>
                    </button>
                  )}
                </div>

                {/* Education Section */}
                {therapist.education && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-white">
                      Education
                    </h3>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {therapist.education.split(";").map((item, index) => (
                          <div
                            key={index}
                            className="mb-2 flex items-start last:mb-0"
                          >
                            <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-teal-500"></div>
                            <p className="text-gray-700 transition-colors duration-300 dark:text-gray-300">
                              {item.trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Experience Section */}
                {therapist.experience && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-white">
                      Experience
                    </h3>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {therapist.experience.split(";").map((item, index) => (
                          <div
                            key={index}
                            className="mb-3 flex items-start last:mb-0"
                          >
                            <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-teal-500"></div>
                            <p className="text-gray-700 transition-colors duration-300 dark:text-gray-300">
                              {item.trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Expertise Section */}
                {therapist.expertise && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-white">
                      Areas of Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {therapist.expertise
                        .split(";")
                        .map((expertise, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800 transition-colors duration-300 dark:bg-teal-900 dark:text-teal-200"
                          >
                            {expertise.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* About Section */}
                {therapist.about && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-white">
                      About
                    </h3>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
                      <p className="leading-relaxed text-gray-700 transition-colors duration-300 dark:text-gray-300">
                        {therapist.about.replace("About", "").trim()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Consultation Modes */}
                {therapist.modes && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-white">
                      Consultation Modes
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {therapist.modes.split(";").map((mode, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 rounded-md bg-green-50 px-3 py-2 text-green-700 transition-colors duration-300 dark:bg-green-900/30 dark:text-green-300"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">
                            {mode.trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 p-4 transition-colors duration-300 sm:flex-row sm:gap-4 dark:border-gray-700 dark:bg-gray-700">
              {therapist.phone && (
                <button
                  onClick={() => makePhoneCall(therapist.phone!)}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-md bg-teal-500 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-teal-600"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </button>
              )}

              {therapist.email && (
                <button
                  onClick={() => sendEmail(therapist.email!)}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
              )}

              {therapist.profile_url && (
                <button
                  onClick={() => openProfile(therapist.profile_url!)}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Globe className="h-4 w-4" />
                  <span>Visit Profile</span>
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
