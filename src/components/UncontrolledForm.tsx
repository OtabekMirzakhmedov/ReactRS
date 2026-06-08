import { useRef, useState } from 'react'
import { formSchema } from '../validation/schema'
import { useFormStore } from '../store/formStore'
import { imageToBase64 } from '../utils/imageToBase64'
import { PasswordStrength } from './PasswordStrength'
import styles from './form.module.css'

interface UncontrolledFormProps {
  onSuccess: () => void
}

type FieldErrors = Partial<Record<string, string>>

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const countries = useFormStore((s) => s.countries)
  const addSubmission = useFormStore((s) => s.addSubmission)
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [passwordValue, setPasswordValue] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    const data = new FormData(form)
    const imageFile = (form.elements.namedItem('image') as HTMLInputElement).files?.[0]

    const raw = {
      name: data.get('name') as string,
      age: Number(data.get('age')),
      email: data.get('email') as string,
      gender: data.get('gender') as string,
      acceptTerms: (form.elements.namedItem('acceptTerms') as HTMLInputElement).checked,
      password: data.get('password') as string,
      confirmPassword: data.get('confirmPassword') as string,
      country: data.get('country') as string,
      image: imageFile,
    }

    const result = formSchema.safeParse(raw)

    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    const imageBase64 = await imageToBase64(result.data.image)
    addSubmission({
      id: crypto.randomUUID(),
      name: result.data.name,
      age: result.data.age,
      email: result.data.email,
      gender: result.data.gender,
      acceptTerms: result.data.acceptTerms,
      password: result.data.password,
      country: result.data.country,
      imageBase64,
      submittedAt: Date.now(),
    })
    onSuccess()
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="uc-name">Name</label>
        <input id="uc-name" name="name" className={styles.input} />
        <span className={styles.error}>{errors.name}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uc-age">Age</label>
        <input id="uc-age" name="age" type="number" className={styles.input} />
        <span className={styles.error}>{errors.age}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uc-email">Email</label>
        <input id="uc-email" name="email" type="email" className={styles.input} />
        <span className={styles.error}>{errors.email}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uc-gender">Gender</label>
        <select id="uc-gender" name="gender" className={styles.select}>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <span className={styles.error}>{errors.gender}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uc-password">Password</label>
        <input
          id="uc-password"
          name="password"
          type="password"
          className={styles.input}
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        <PasswordStrength password={passwordValue} />
        <span className={styles.error}>{errors.password}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uc-confirm">Confirm Password</label>
        <input id="uc-confirm" name="confirmPassword" type="password" className={styles.input} />
        <span className={styles.error}>{errors.confirmPassword}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uc-country">Country</label>
        <input
          id="uc-country"
          name="country"
          list="uc-countries-list"
          className={styles.input}
        />
        <datalist id="uc-countries-list">
          {countries.map((c) => <option key={c} value={c} />)}
        </datalist>
        <span className={styles.error}>{errors.country}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="uc-image">Profile Image (PNG/JPEG, max 2 MB)</label>
        <input id="uc-image" name="image" type="file" accept="image/png,image/jpeg" className={styles.input} />
        <span className={styles.error}>{errors.image}</span>
      </div>

      <div className={styles.field}>
        <div className={styles.checkboxRow}>
          <input id="uc-terms" name="acceptTerms" type="checkbox" />
          <label htmlFor="uc-terms" className={styles.label}>I accept the Terms and Conditions</label>
        </div>
        <span className={styles.error}>{errors.acceptTerms}</span>
      </div>

      <button type="submit" className={styles.submitBtn}>
        Submit
      </button>
    </form>
  )
}
