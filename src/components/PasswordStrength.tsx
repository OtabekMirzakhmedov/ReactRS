import styles from './PasswordStrength.module.css'

export function getPasswordStrength(password: string): { score: number; label: string; checks: Record<string, boolean> } {
  const checks = {
    number: /\d/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  const score = Object.values(checks).filter(Boolean).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[score] ?? '', checks }
}

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null
  const { score, label, checks } = getPasswordStrength(password)

  return (
    <div className={styles.wrapper}>
      <div className={styles.bars}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`${styles.bar} ${styles[`score${score >= i ? score : 0}`]}`} />
        ))}
      </div>
      <span className={styles.label}>{label}</span>
      <ul className={styles.checks}>
        <li className={checks.number ? styles.met : styles.unmet}>1 number</li>
        <li className={checks.uppercase ? styles.met : styles.unmet}>1 uppercase</li>
        <li className={checks.lowercase ? styles.met : styles.unmet}>1 lowercase</li>
        <li className={checks.special ? styles.met : styles.unmet}>1 special character</li>
      </ul>
    </div>
  )
}
