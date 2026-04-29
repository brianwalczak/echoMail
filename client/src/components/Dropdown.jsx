import { useState, useRef, useEffect } from "react";

export default function Dropdown({ value, onChange, options }) {
    const selected = options.find(o => o.value === value);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative mb-4">
            <button type="button" onClick={() => setOpen(o => !o)} className="w-full p-3 pr-10 text-left bg-white/5 border border-white/10 rounded-xl text-white cursor-pointer hover:bg-white/10 transition">
                {selected?.label}

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`size-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {open && (
                <ul className="absolute z-10 mt-1 w-full bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                    {options.map(o => (
                        <li
                            key={o.value}
                            onClick={() => { onChange(o.value); setOpen(false); }}
                            className={`px-4 py-2.5 text-left cursor-pointer transition ${o.value === value ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}
                        >
                            {o.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
