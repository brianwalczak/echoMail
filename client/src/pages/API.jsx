export default function API() {
    return (
        <main className="flex items-center justify-start flex-col text-center px-4 min-h-screen pt-32 border-b border-gray-400/30">
            <div className="animated animatedFadeInUp fadeInUp max-w-3xl w-full">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">API Docs</h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8">Integrate disposable email addresses for your application in seconds.</p>

                <section className="mb-12 text-left">
                    <h2 className="text-2xl font-semibold text-white mb-3">Creating a Session</h2>
                    <p className="text-gray-300 mb-3">Creates a new session. Returns a session identifier and session token (required for authentication).</p>

                    <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto mb-3">
{`POST /api/session
{
    "method": "create",
    "duration": "24h" // Optional, valid values: "24h", "48h", "3d", "7d" (default: "24h")
}`}
                    </pre>

                    <p className="text-gray-300 mb-1">Response (<b>201 Created</b>):</p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto mb-3">
{`{
    "success": true,
    "token": "1HvdCqHkCVj6u4H_frRlzUeXve2mjvjfKq9aTBSMdMu6DqKkzyeFRGEWB06snN3baqjqMk7bkOfDi82Q",
    "data": {
        "id": "kgrmibo",
        "createdAt": "2025-09-07T00:38:02.910Z",
        "expiresAt": "2025-09-08T00:38:02.782Z"
    }
}`}
                    </pre>
                    <small className="text-gray-300"><b>Note:</b> All timestamps are in UTC.</small>
                </section>

                <section className="mb-12 text-left">
                    <h2 className="text-2xl font-semibold text-white mb-3">Get Session</h2>
                    <p className="text-gray-300 mb-3">Retrieves session details, including messages, using the session identifier and token.</p>

                    <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto mb-3">
{`POST /api/session
{
    "method": "get",
    "id": "kgrmibo",
    "token": "1HvdCqHkCVj6u4H_frRlzUeXve2mjvjfKq9aTBSMdMu6DqKkzyeFRGEWB06snN3baqjqMk7bkOfDi82Q"
}`}
                    </pre>

                    <p className="text-gray-300 mb-1">Response (<b>200 OK</b>):</p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto mb-3">
{`{
    "success": true,
    "data": {
        "id": "kgrmibo",
        "createdAt": "2025-09-07T00:38:02.910Z",
        "expiresAt": "2025-09-08T00:38:02.782Z",
        "messages": [{
            "id": 1,
            "sessionId": "kgrmibo",
            "from": "hello@example.com",
            "subject": "We've received your submission.",
            "body": "Hello! You've successfully received a plain text message body.",
            "html": "<p>Thanks for <strong>signing up</strong>. We're glad to have you.</p>",
            "receivedAt": "2025-09-07T00:38:03.910Z"
        }]
    }
}`}
                    </pre>
                    <small className="text-gray-300"><b>Note:</b> All timestamps are in UTC. The <code>html</code> field is optional, and will be <code>null</code> if the original email did not include HTML content.</small>
                </section>

                <section className="mb-12 text-left">
                    <h2 className="text-2xl font-semibold text-white mb-3">Revoke Session</h2>
                    <p className="text-gray-300 mb-3">Revokes a session using the session identifier and token (permanent deletion).</p>

                    <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto mb-3">
{`POST /api/session
{
    "method": "revoke",
    "id": "kgrmibo",
    "token": "1HvdCqHkCVj6u4H_frRlzUeXve2mjvjfKq9aTBSMdMu6DqKkzyeFRGEWB06snN3baqjqMk7bkOfDi82Q"
}`}
                    </pre>

                    <p className="text-gray-300 mb-1">Response (<b>200 OK</b>):</p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto mb-3">
{`{
    "success": true,
    "data": {
        "id": "kgrmibo",
        "createdAt": "2025-09-07T00:38:02.910Z",
        "expiresAt": "2025-09-08T00:38:02.782Z"
    }
}`}
                    </pre>
                    <small className="text-gray-300"><b>Note:</b> All timestamps are in UTC. For revoked sessions, the response contains the deleted session's data; the session no longer exists.</small>
                </section>
        </div>
    </main>
);
}