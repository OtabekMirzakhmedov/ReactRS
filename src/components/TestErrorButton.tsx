import { useState } from 'react';

export default function TestErrorButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error triggered by user');
  }

  return (
    <button className="error-test-btn" onClick={() => setShouldThrow(true)}>
      Trigger Error (test)
    </button>
  );
}
