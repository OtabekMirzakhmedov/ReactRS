import { useEffect, useState } from 'react'
import type { Formsubmission } from '../types/form'
import styles from './SubmissionCard.module.css'

interface SubmissionCardProps {
  submission: Formsubmission
  isNew: boolean
}

export function SubmissionCard({ submission, isNew }: SubmissionCardProps) {
  const [highlight, setHighlight] = useState(isNew)

  useEffect(() => {
    if (!isNew) return
    const timer = setTimeout(() => setHighlight(false), 3000)
    return () => clearTimeout(timer)
  }, [isNew])

  return (
    <article className={`${styles.card} ${highlight ? styles.new : ''}`}>
      {submission.imageBase64 && (
        <img src={submission.imageBase64} alt={`${submission.name}'s profile`} className={styles.avatar} />
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>{submission.name}</h3>
        <p>Age: {submission.age}</p>
        <p>Email: {submission.email}</p>
        <p>Gender: {submission.gender}</p>
        <p>Country: {submission.country}</p>
      </div>
    </article>
  )
}
