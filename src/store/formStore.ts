import { create } from 'zustand'
import type { Formsubmission } from '../types/form'

export const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia',
  'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'Ethiopia', 'Finland',
  'France', 'Germany', 'Ghana', 'Greece', 'Hungary', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya',
  'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria',
  'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania',
  'Russia', 'Saudi Arabia', 'South Africa', 'South Korea', 'Spain', 'Sweden',
  'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom',
  'United States', 'Uzbekistan', 'Vietnam',
]

interface FormStore {
  submissions: Formsubmission[]
  countries: string[]
  addSubmission: (submission: Formsubmission) => void
}

export const useFormStore = create<FormStore>((set) => ({
  submissions: [],
  countries: COUNTRIES,
  addSubmission: (submission) =>
    set((state) => ({ submissions: [submission, ...state.submissions] })),
}))
