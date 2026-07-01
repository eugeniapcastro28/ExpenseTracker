import { useEffect, useState } from 'react';
import { Undo2 } from 'lucide-react';

const UNDO_SECONDS = 4;

function UndoToast({ message, onUndo, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(UNDO_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onExpire]);

  return (
    <div className="undo-toast">
      <span className="undo-toast-msg">{message}</span>
      <button className="undo-toast-btn" onClick={onUndo} type="button">
        <Undo2 size={14} />
        Undo
      </button>
    </div>
  );
}

export default UndoToast;