import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, type FormValues } from '../validation/schema'
import { useFormStore } from '../store/formStore'
import { imageToBase64 } from '../utils/imageToBase64'
import { PasswordStrength } from './PasswordStrength'
import styles from './form.module.css'

interface RhfFormProps {
  onSuccess: () => void
}

export function RhfForm({ onSuccess }: RhfFormProps) {
  const countries = useFormStore((s) => s.countries)
  const addSubmission = useFormStore((s) => s.addSubmission)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  const password = watch('password') ?? ''

  async function onSubmit(data: FormValues) {
    const imageBase64 = await imageToBase64(data.image)
    addSubmission({
      id: crypto.randomUUID(),
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      acceptTerms: data.acceptTerms,
      password: data.password,
      country: data.country,
      imageBase64,
      submittedAt: Date.now(),
    })
    onSuccess()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-name">Name</label>
        <input id="rhf-name" className={styles.input} {...register('name')} />
        <span className={styles.error}>{errors.name?.message}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-age">Age</label>
        <input
          id="rhf-age"
          type="number"
          className={styles.input}
          {...register('age', { valueAsNumber: true })}
        />
        <span className={styles.error}>{errors.age?.message}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-email">Email</label>
        <input id="rhf-email" type="email" className={styles.input} {...register('email')} />
        <span className={styles.error}>{errors.email?.message}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-gender">Gender</label>
        <select id="rhf-gender" className={styles.select} {...register('gender')}>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <span className={styles.error}>{errors.gender?.message}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-password">Password</label>
        <input id="rhf-password" type="password" className={styles.input} {...register('password')} />
        <PasswordStrength password={password} />
        <span className={styles.error}>{errors.password?.message}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-confirm">Confirm Password</label>
        <input id="rhf-confirm" type="password" className={styles.input} {...register('confirmPassword')} />
        <span className={styles.error}>{errors.confirmPassword?.message}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-country">Country</label>
        <input
          id="rhf-country"
          list="rhf-countries-list"
          className={styles.input}
          {...register('country')}
        />
        <datalist id="rhf-countries-list">
          {countries.map((c) => <option key={c} value={c} />)}
        </datalist>
        <span className={styles.error}>{errors.country?.message}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="rhf-image">Profile Image (PNG/JPEG, max 2 MB)</label>
        <input
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg"
          className={styles.input}
          {...register('image', {
            setValueAs: (v: FileList) => v?.[0] ?? undefined,
          })}
        />
        <span className={styles.error}>{errors.image?.message}</span>
      </div>

      <div className={styles.field}>
        <div className={styles.checkboxRow}>
          <input id="rhf-terms" type="checkbox" {...register('acceptTerms')} />
          <label htmlFor="rhf-terms" className={styles.label}>I accept the Terms and Conditions</label>
        </div>
        <span className={styles.error}>{errors.acceptTerms?.message}</span>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={!isValid}>
        Submit
      </button>
    </form>
  )
}
