/** Shared UI atoms for both the DANA host-app replicas and the Mini Program screens. */

const ICONS = {
  back: 'M15 19l-7-7 7-7',
  next: 'M9 5l7 7-7 7',
  check: 'M5 13l4 4L19 7',
  close: 'M6 6l12 12M18 6L6 18',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  copy: 'M8 8V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2M6 8h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z',
  share: 'M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M12 3v12M8 7l4-4 4 4',
  qr: 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h3m3 0h-3m0 0v3m0-6v0',
  gift: 'M4 11h16v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9zM3 7h18v4H3V7zm9 0v14M8 7a2 2 0 110-4c2 0 4 4 4 4M16 7a2 2 0 100-4c-2 0-4 4-4 4',
  store: 'M4 9h16v11H4V9zm-1 0l2-5h14l2 5M9 20v-6h6v6',
  users: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M12 7a3 3 0 11-6 0 3 3 0 016 0zm9 12v-1a4 4 0 00-3-3.9M16 4.1a4 4 0 010 7.8',
  pin: 'M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11zm0-8.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
  bell: 'M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0',
  wallet: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm13 4h3',
  download: 'M12 4v10m0 0l-4-4m4 4l4-4M4 18h16',
  lock: 'M7 11V8a5 5 0 0110 0v3M5 11h14v9H5v-9z',
  trophy: 'M8 4h8v4a4 4 0 11-8 0V4zM6 4H4v2a3 3 0 003 3M18 4h2v2a3 3 0 01-3 3M10 16h4v4h-4v-4z',
  play: 'M8 5l11 7-11 7V5z',
  sound: 'M11 5L6 9H3v6h3l5 4V5zm5 2a5 5 0 010 10',
  camera: 'M4 8h3l2-2h6l2 2h3v11H4V8zm8 3a3 3 0 100 6 3 3 0 000-6z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35',
  bolt: 'M13 3L5 14h5l-1 7 8-11h-5l1-7z',
  topup: 'M12 15V4m0 0L8 8m4-4l4 4M4 20h16',
  request: 'M12 4v11m0 0l-4-4m4 4l4-4M4 20h16',
  send: 'M3 12l18-8-8 18-2.5-7.5L3 12z',
  inbox: 'M4 6h16v12H4V6zm0 0l8 7 8-7',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6zm10 2.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  eyeOff: 'M3 3l18 18M10.6 10.6a2.5 2.5 0 003.4 3.4M6.5 6.7C3.9 8.4 2 12 2 12s3.5 6 10 6c1.8 0 3.4-.4 4.7-1.1M21.9 12.6C20.8 10.7 18 6 12 6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z',
  ticket: 'M4 8h16v3a2 2 0 000 4v3H4v-3a2 2 0 000-4V8z',
  game: 'M6 8h12l2 9H4l2-9zm2 4h3m-1.5-1.5v3M16 11h.01M18 13h.01',
  plane: 'M2 16l20-6L2 4l5 6-5 6z',
  coffee: 'M4 8h12v6a4 4 0 01-4 4H8a4 4 0 01-4-4V8zm12 1h2a2 2 0 010 4h-2M4 21h14',
  heart: 'M12 20s-7-4.5-7-9a4 4 0 017-2.5A4 4 0 0119 11c0 4.5-7 9-7 9z',
  doc: 'M6 3h9l3 3v15H6V3zm3 8h6M9 15h6',
  home: 'M4 11l8-7 8 7v9H4v-9z',
  activity: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3zm3 5h6M9 12h6',
  person: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-8 8a8 8 0 0116 0',
  cart: 'M4 5h2l2 10h10l2-7H7M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z',
};

export function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={ICONS[name] ?? ICONS.store} />
    </svg>
  );
}

export function StatusBar({ dark = false }) {
  return (
    <div className={`flex h-11 items-center justify-between px-6 pt-1 text-[11px] font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
      <span>19.53</span>
      <span className="flex items-center gap-1">
        <span className="tracking-tighter">▮▮▮</span>
        <span>LTE</span>
        <span className="rounded-sm border border-current px-1">16</span>
      </span>
    </div>
  );
}

export function TopBar({ title, onBack, dark = false, right = null }) {
  return (
    <div className={`flex items-center gap-3 px-4 pb-3 ${dark ? 'text-white' : 'text-slate-900'}`}>
      {onBack && (
        <button onClick={onBack} aria-label="Kembali" className="-ml-1 rounded-full p-1 active:bg-black/10">
          <Icon name="back" />
        </button>
      )}
      <h2 className="flex-1 text-base font-bold">{title}</h2>
      {right}
    </div>
  );
}

export function Btn({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-dana-500 text-white shadow-lg shadow-dana-500/30 active:bg-dana-600 disabled:bg-slate-300 disabled:shadow-none',
    green: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 active:bg-emerald-600 disabled:bg-slate-300 disabled:shadow-none',
    ghost: 'border border-dana-500 bg-white text-dana-700 active:bg-dana-50',
    subtle: 'bg-slate-100 text-slate-700 active:bg-slate-200',
  }[variant];
  return (
    <button
      {...props}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Pill({ children, tone = 'dana' }) {
  const tones = {
    dana: 'bg-dana-50 text-dana-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    violet: 'bg-violet-50 text-violet-700',
    slate: 'bg-slate-100 text-slate-600',
  };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${tones[tone]}`}>{children}</span>;
}

export const Shell = ({ children, className = '' }) => (
  <div className={`screen-in flex min-h-full flex-col bg-slate-100 ${className}`}>{children}</div>
);

export const Field = ({ step, label, hint, children }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm">
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dana-500 text-[11px] font-bold text-white">
        {step}
      </span>
      <p className="text-xs font-bold text-slate-800">{label}</p>
    </div>
    <div className="mt-3">{children}</div>
    {hint && <p className="mt-2 text-[10px] text-slate-400">{hint}</p>}
  </div>
);

/**
 * Bottom navigation of the DANA host app, matching production:
 * Home · Activity · PAY (elevated) · Wallet · Me.
 */
export function HostNav({ active, go, notify }) {
  const item = (icon, label, onClick) => (
    <button
      key={label}
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 text-[10px] font-bold ${
        label === active ? 'text-slate-900' : 'text-slate-400'
      }`}
    >
      <Icon name={icon} className="h-6 w-6" />
      {label}
    </button>
  );
  return (
    <div className="sticky bottom-0 mt-auto border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="relative flex items-end px-2 pt-2 pb-5">
        {item('home', 'Home', () => go('home'))}
        {item('activity', 'Activity', () => notify('Di luar cakupan prototipe.'))}
        <div className="flex flex-1 justify-center">
          <button
            onClick={() => notify('Pemindai QRIS: di luar cakupan prototipe.')}
            className="-mt-7 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-dana-500 text-white shadow-lg shadow-dana-500/40"
          >
            <Icon name="qr" className="h-6 w-6" />
            <span className="text-[10px] font-bold">PAY</span>
          </button>
        </div>
        {item('wallet', 'Wallet', () => notify('Di luar cakupan prototipe.'))}
        {item('person', 'Me', () => go('bizdash'))}
      </div>
    </div>
  );
}

/** Colored app tile used by the home shortcut grid and All Services grid. */
export function ServiceTile({ label, icon, tone = 'slate', badge, onClick }) {
  const tones = {
    dana: 'bg-dana-50 text-dana-600',
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-50 text-red-500',
    rose: 'bg-rose-50 text-rose-500',
    amber: 'bg-amber-50 text-amber-600',
    orange: 'bg-orange-50 text-orange-500',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    slate: 'bg-slate-100 text-slate-500',
    dark: 'bg-slate-900 text-white',
  };
  return (
    <button onClick={onClick} className="relative flex flex-col items-center gap-1.5">
      {badge && (
        <span className="absolute -top-1.5 right-1 z-10 rounded-md bg-red-500 px-1 py-0.5 text-[7px] font-bold text-white">
          {badge}
        </span>
      )}
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
        <Icon name={icon} />
      </span>
      <span className="line-clamp-2 text-center text-[10px] leading-tight font-semibold text-slate-700">{label}</span>
    </button>
  );
}
