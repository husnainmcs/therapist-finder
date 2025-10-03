// src/types/therapist.ts
export interface Therapist {
  id: string;
  name: string;
  profile_url: string | null;
  gender: string;
  city: string;
  experience_years: number | null;
  email: string | null;
  emails_all: string | null;
  phone: string | null;
  modes: string | null;
  education: string | null;
  experience: string | null;
  expertise: string | null;
  about: string | null;
  fees_raw: string | null;
  fee_amount: number | null;
  fee_currency: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Simplified version for card display
export interface TherapistCardData {
  id: string;
  name: string;
  gender: string;
  city: string;
  experience_years: number | null;
  fee_amount: number | null;
  fee_currency: string | null;
  expertise: string | null;
}


