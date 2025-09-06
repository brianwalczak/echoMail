import { useEffect, useState } from "react";
import { parseDate } from '../utils.jsx';
import DOMPurify from 'dompurify';

const FADE_DURATION = 300; // ms

const MailViewer = ({ mail, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(null);
  if (!mail) return null;

  // used to trigger fade in animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []); // on mount

  // used to trigger fade out animation and call onClose callback
  useEffect(() => {
    if (status === null) return;
    setVisible(false);

    if (onClose) {
      const timer = setTimeout(() => onClose(status), FADE_DURATION);

      return () => clearTimeout(timer);
    }
  }, [status]); // on status change (clicked cancel or confirm)

  return (
    <div className={`mail fixed inset-0 z-50 bg-black/70 flex items-center justify-center text-left mx-5 ${visible ? 'visible' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{mail.subject}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">From: {mail.from} • {parseDate(mail.receivedAt)}</p>
          </div>
          <button onClick={() => setStatus(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {mail.body && (
            <pre className={`whitespace-pre-wrap text-sm ${mail.html ? 'border-b border-gray-300/50 mb-3 pb-3' : ''}`}>{mail.body}</pre>
          )}
          {mail.html && (
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mail.html, { USE_PROFILES: { html: true } }) }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MailViewer;