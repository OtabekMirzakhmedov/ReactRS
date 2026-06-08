export interface Formsubmission {
  id: string
  name: string
  age: number
  email: string
  gender: 'male' | 'female' | 'other'
  acceptTerms: boolean
  password: string
  country: string
  imageBase64: string
  submittedAt: number
}
