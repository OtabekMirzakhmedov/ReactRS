import { z } from 'zod'
import { COUNTRIES } from '../store/formStore'

function validateEmail(email: string): boolean {
  const atIndex = email.indexOf('@')
  const lastAt = email.lastIndexOf('@')
  if (atIndex === -1 || atIndex !== lastAt) return false
  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex + 1)
  if (!local) return false
  if (!domain.includes('.')) return false
  const dotIndex = domain.indexOf('.')
  if (dotIndex === 0 || dotIndex === domain.length - 1) return false
  return true
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/png', 'image/jpeg']

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine((v) => v.length === 0 || v[0] === v[0].toUpperCase(), 'First letter must be uppercase'),
    age: z
      .number({ error: 'Age must be a number' })
      .int('Age must be a whole number')
      .nonnegative('Age cannot be negative'),
    email: z
      .string()
      .min(1, 'Email is required')
      .refine(validateEmail, 'Enter a valid email address'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Select a gender' }),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, { message: 'You must accept the terms' }),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    country: z
      .string()
      .min(1, 'Country is required')
      .refine((v) => COUNTRIES.includes(v), 'Select a valid country from the list'),
    image: z
      .instanceof(File, { message: 'Image is required' })
      .refine((f) => ALLOWED_TYPES.includes(f.type), 'Only PNG or JPEG images are allowed')
      .refine((f) => f.size <= MAX_IMAGE_SIZE, 'Image must be 2 MB or smaller'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type FormValues = z.infer<typeof formSchema>
