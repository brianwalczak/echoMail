import { useEffect, useState } from "react";

const FADE_DURATION = 300; // ms

const Dialog = ({ id, type, title, body, cancel, confirm, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState(null);

    // used to trigger fade in animation
    useEffect(() => {
        setVisible(true);
    }, []); // on mount

    // used to trigger fade out animation and call onClose callback
    useEffect(() => {
        if(status === null) return;
        setVisible(false);

        if (onClose) {
            const timer = setTimeout(() => onClose(status), FADE_DURATION);
            
            return () => clearTimeout(timer);
        }
    }, [status]); // on status change (clicked cancel or confirm)

    {/* https://tailwindcss.com/plus/ui-blocks/application-ui/overlays/modal-dialogs (modified file) */ }
    return (
        <div id={id} className={`dialog fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent z-5000 ${visible ? 'visible' : ''}`}>
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

            <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            {type === "success" && (
                                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                            )}

                            {type === "warning" && (
                                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:size-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-yellow-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                </div>
                            )}

                            {type === "danger" && (
                                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-red-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                    </svg>
                                </div>
                            )}
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">{body}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        {confirm && (
                            <button onClick={() => setStatus(true)} className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto ${
                                type === "success"
                                    ? "bg-green-600 hover:bg-green-500"
                                    : type === "warning"
                                    ? "bg-yellow-500 hover:bg-yellow-400"
                                    : "bg-red-600 hover:bg-red-500"
                            }`}>{confirm || 'Confirm'}</button>
                        )}

                        {cancel && (
                            <button onClick={() => setStatus(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">{cancel || 'Cancel'}</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dialog;