import { getCookie, setCookie, parseDate } from '../utils.jsx';
import { useEffect, useState } from "react";
import MailViewer from '../components/MailViewer.jsx';
import Toast from '../components/Toast.jsx';
import Dialog from '../components/Dialog.jsx';

export default function Mail() {
    const [loading, setLoading] = useState(false);
    const [inbox, setInbox] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);

    const [activeMail, setActiveMail] = useState(null);
    const [toast, setToast] = useState(null);
    const [dialog, setDialog] = useState(null);

    const [tab, setTab] = useState('create');
    const [duration, setDuration] = useState('24h');
    const [existingId, setExistingId] = useState('');
    const [existingToken, setExistingToken] = useState('');

    const session = async (body, isLoading, onSuccess, onError) => {
        try {
            if (isLoading) setLoading(isLoading);

            const req = await fetch('/api/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();
            if (isLoading) setLoading(false);

            if (res.success) {
                onSuccess(res);
            } else {
                setToast({ id: "err-toast", type: "error", message: res.reason ?? "It looks like your session has expired or is invalid.", onClose: () => setToast(null), seconds: 3 });
                if (onError) onError(res);
            }
        } catch (error) {
            if (isLoading) setLoading(false);

            setToast({ id: "err-toast", type: "error", message: "An unexpected error occurred. Please try again.", onClose: () => setToast(null), seconds: 3 });
            if (onError) onError(error);
        }
    };

    const createInbox = ({ loading = true, toast = false } = {}) => {
        session({ method: 'create', duration: (duration || '24h') }, (loading ? "Creating, please wait..." : null), (res) => {
            setCookie('session_id', res.data.id);
            setCookie('session_token', res.token);
            setInbox([]); // start with empty inbox
            setExpiresAt(res.data.expiresAt);

            if (toast) setToast({ id: "create-success", type: "success", message: "Your disposable inbox has been created!", onClose: () => setToast(null), seconds: 3 });
        });
    };

    const destroyInbox = ({ loading = true, toast = false } = {}) => {
        const sessionId = getCookie('session_id');
        const sessionToken = getCookie('session_token');

        if (!sessionId || !sessionToken) {
            return setToast({ id: "err-toast", type: "warning", message: "It looks like your session has expired.", onClose: () => setToast(null), seconds: 3 });
        }

        session({ method: 'revoke', id: sessionId, token: sessionToken }, (loading ? "Deleting, please wait..." : null), (res) => {
            setCookie('session_id', '', -1);
            setCookie('session_token', '', -1);
            setInbox(null);

            if (toast) setToast({ id: "destroy-success", type: "success", message: "Your disposable inbox has been permanently removed.", onClose: () => setToast(null), seconds: 3 });
        });
    };

    const fetchInbox = ({ loading = true, toast = false } = {}) => {
        const sessionId = getCookie('session_id');
        const sessionToken = getCookie('session_token');

        if (!sessionId || !sessionToken) {
            return setToast({ id: "err-toast", type: "warning", message: "It looks like your session has expired.", onClose: () => setToast(null), seconds: 3 });
        }

        session({ method: 'get', id: sessionId, token: sessionToken }, (loading ? "Updating, please wait..." : null), (res) => {
            setInbox(res.data?.messages || []);
            setExpiresAt(res.data.expiresAt);

            if (toast) setToast({ id: "fetch-success", type: "success", message: "Your inbox has been updated successfully!", onClose: () => setToast(null), seconds: 3 });
        }, (error) => {
            if (error.success === false) {
                setCookie('session_id', '', -1);
                setCookie('session_token', '', -1);
                setInbox(null);
            }
        });
    };

    const copyToClipboard = ({ toast = false } = {}) => {
        try {
            const email = `${getCookie('session_id')}@${window.location.host}`;
            navigator.clipboard.writeText(email);

            if (toast) setToast({ id: "copy-success", type: "success", message: "Email address copied to clipboard!", onClose: () => setToast(null), seconds: 3 });
        } catch (error) {
            if (toast) setToast({ id: "err-toast", type: "error", message: "Failed to copy email address.", onClose: () => setToast(null), seconds: 3 });
        }
    };

    const openMail = (id) => {
        const mail = inbox.find(m => m.id === id);
        if (!mail) return setToast({ id: "err-toast", type: "error", message: "Failed to open your message. It may have been deleted.", onClose: () => setToast(null), seconds: 3 });

        return setActiveMail(mail);
    };

    const loadExisting = () => {
        if (!existingId || !existingToken) {
            return setToast({ id: "err-toast", type: "error", message: "Please provide both a session ID and token.", onClose: () => setToast(null), seconds: 3 });
        }

        setCookie('session_id', existingId);
        setCookie('session_token', existingToken);

        setExistingId('');
        setExistingToken('');
        return fetchInbox({ loading: true, toast: true });
    };

    // setup automatic inbox refresh every 10 seconds
    useEffect(() => {
        const refreshInbox = () => {
            const sessionId = getCookie('session_id');
            const sessionToken = getCookie('session_token');

            if (sessionId && sessionToken) {
                fetchInbox();
            }
        };

        refreshInbox();
        const interval = setInterval(refreshInbox, 10000);

        return () => clearInterval(interval);
    }, []); // on mount

    return (
        <main className="flex items-center justify-start flex-col text-center px-4 min-h-screen pt-32 border-b border-gray-400/30">
            <h1 className="text-5xl md:text-5xl font-bold mb-6 text-white">{inbox ? 'Inbox Dashboard' : 'Create an Inbox'}</h1>
            <p className={`text-lg md:text-xl text-gray-300 ${inbox ? 'mb-4' : 'mb-8'}`}>{inbox ? 'Access your disposable inbox\'s messages below.' : 'Get started by creating a new disposable inbox in seconds.'}</p>

            {toast && <Toast {...toast} />}
            {dialog && <Dialog {...dialog} />}
            {activeMail && (<MailViewer mail={activeMail} onClose={() => setActiveMail(null)} />)}

            {!inbox ? (
                <div className="w-full max-w-md mx-auto rounded-lg p-8 shadow border border-gray-400/30 bg-white/20 transition">
                    <div className="flex mb-6">
                        <button onClick={() => setTab('create')} className={`flex-1 py-2 font-semibold rounded-l-lg text-white ${tab === 'create' ? 'bg-blue-700' : 'bg-white/20'}`}>Create New</button>
                        <button onClick={() => setTab('existing')} className={`flex-1 py-2 font-semibold rounded-r-lg text-white ${tab === 'existing' ? 'bg-blue-700' : 'bg-white/20'}`}>Use Existing</button>
                    </div>
                    {tab === 'create' && (
                        <form onSubmit={e => { e.preventDefault(); createInbox({ toast: true }); }}>
                            <label className="block text-left mb-2 text-white font-semibold">Duration</label>

                            <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full mb-4 p-2 rounded bg-gray-800 text-white" required>
                                <option value="24h">24 Hours</option>
                                <option value="48h">48 Hours</option>
                                <option value="3d">3 Days</option>
                                <option value="7d">7 Days</option>
                            </select>

                            <button type="submit" className="w-full bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-800 transition" disabled={(loading !== false)}>{(loading !== false) ? loading : "Create Temporary Email"}</button>
                        </form>
                    )}
                    {tab === 'existing' && (
                        <>
                            <form onSubmit={e => { e.preventDefault(); loadExisting(); }}>
                                <label className="block text-left mb-2 text-white font-semibold">Session ID</label>
                                <input type="text" value={existingId} onChange={e => setExistingId(e.target.value)} className="w-full mb-4 p-2 rounded bg-gray-800 text-white" placeholder="Enter session identifier" required />
                                
                                <label className="block text-left mb-2 text-white font-semibold">Session Token</label>
                                <input type="text" value={existingToken} onChange={e => setExistingToken(e.target.value)} className="w-full mb-4 p-2 rounded bg-gray-800 text-white" placeholder="Enter session token" required />
                                
                                <button type="submit" className="w-full bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-800 transition" disabled={(loading !== false)}>{(loading !== false) ? loading : "Use Existing Inbox"}</button>
                            </form>

                            <p className="text-sm mt-3">Learn more about API usage and sessions <a href="/api" className="underline">here</a>.</p>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <div onClick={() => copyToClipboard({ toast: true })} className="text-xl font-bold text-blue-500 mb-2 rounded-md px-3 py-1.5 border border-transparent hover:border-gray-400/30 hover:bg-white/20 hover:text-white transition active:bg-gray-700 active:text-gray-400">{`${getCookie('session_id')}@${window.location.host}`}</div>
                        <button onClick={() => fetchInbox({ toast: true })} className="md:inline-block bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-800 transition" disabled={(loading !== false)}>{(loading !== false) ? loading : "Refresh Inbox"}</button>
                        <button onClick={() => setDialog({ id: "destroy", type: "danger", title: "Destroy disposable inbox?", body: "Are you sure you want to destroy your disposable inbox? All received emails will be permanently deleted and cannot be recovered.", cancel: "Cancel", confirm: "Destroy", onClose: (status) => { setDialog(null); if (status === true) destroyInbox({ toast: true }); } })} className="md:inline-block bg-transparent text-red-500 font-semibold py-3 px-6 rounded-lg shadow border border-red-500 hover:bg-red-700 hover:text-white transition ml-3" disabled={(loading !== false)}>Destroy Inbox</button>
                    </div>
                    {expiresAt && (<p className="text-sm text-gray-400 mb-4">This inbox will expire on <b>{parseDate(expiresAt)}</b>. You can create a new inbox at any time.</p>)}

                    <div className="rounded-md border border-gray-400/30 bg-white/20 transition p-6 w-full max-w-4xl overflow-y-auto">
                        {inbox.length === 0 ? (
                            <p className="text-gray-300">No emails have been received yet. Your inbox will update automatically.</p>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-white text-left mb-4">All Messages</h2>

                                <ul>
                                    {inbox.map(mail => (
                                        <li key={mail.id} onClick={() => openMail(mail.id)} className="text-left rounded-lg transition hover:bg-white/10 hover:shadow-lg hover:text-white cursor-pointer p-4">
                                            <div className="font-bold text-white">{mail.subject}</div>
                                            <div className="text-gray-400 text-sm">{mail.from} • {parseDate(mail.receivedAt)}</div>
                                            <p className="text-gray-300 mt-2 truncate">{mail.body.length > 150 ? mail.body.slice(0, 150) + '…' : mail.body}</p>
                                        </li>
                                    ))}
                                </ul>

                                <p className="text-gray-400 mt-4">No more results to show.</p>
                            </>
                        )}
                    </div>
                </>
            )}
        </main >
    );
}