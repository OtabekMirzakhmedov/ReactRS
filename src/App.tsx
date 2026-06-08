import { useState } from 'react'
import { Modal } from './components/Modal'
import { UncontrolledForm } from './components/UncontrolledForm'
import { RhfForm } from './components/RhfForm'
import { SubmissionCard } from './components/SubmissionCard'
import { useFormStore } from './store/formStore'
import styles from './App.module.css'

type FormType = 'uncontrolled' | 'rhf' | null

export default function App() {
  const [openForm, setOpenForm] = useState<FormType>(null)
  const [latestId, setLatestId] = useState<string | null>(null)
  const submissions = useFormStore((s) => s.submissions)

  function handleSuccess() {
    const top = useFormStore.getState().submissions[0]
    setLatestId(top?.id ?? null)
    setOpenForm(null)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>React Forms</h1>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => setOpenForm('uncontrolled')}>
            Open Uncontrolled Form
          </button>
          <button className={styles.btn} onClick={() => setOpenForm('rhf')}>
            Open React Hook Form
          </button>
        </div>
      </header>

      <Modal
        isOpen={openForm === 'uncontrolled'}
        onClose={() => setOpenForm(null)}
        title="Uncontrolled Form"
      >
        <UncontrolledForm onSuccess={handleSuccess} />
      </Modal>

      <Modal
        isOpen={openForm === 'rhf'}
        onClose={() => setOpenForm(null)}
        title="React Hook Form"
      >
        <RhfForm onSuccess={handleSuccess} />
      </Modal>

      <main>
        {submissions.length === 0 ? (
          <p className={styles.empty}>No submissions yet. Open a form to get started.</p>
        ) : (
          <div className={styles.grid}>
            {submissions.map((s) => (
              <SubmissionCard key={s.id} submission={s} isNew={s.id === latestId} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
