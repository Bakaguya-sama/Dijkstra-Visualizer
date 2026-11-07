import { useEffect, useState } from 'react';
import { vi } from '../i18n/vi';

type ShortcutGroup = { readonly title: string; readonly items: readonly (readonly [string, string])[] };

function ShortcutGroups({ groups }: { groups: readonly ShortcutGroup[] }) {
  return groups.map((group) => <div className="shortcut-group" key={group.title}>
    <h3>{group.title}</h3>
    {group.items.map(([label, keys]) => <div className="shortcut-row" key={label}><span>{label}</span><kbd>{keys}</kbd></div>)}
  </div>);
}

function KeyboardIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M6 9h1M10 9h1M14 9h1M18 9h.1M6 13h1M10 13h1M14 13h4M6 16h8"/></svg>;
}

export function ShortcutHelp() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === '?' && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  return <div className="shortcut-help">
    {open && <section className="shortcut-popover" aria-label={vi.shortcuts}>
      <div className="shortcut-heading">
        <h2 className="desktop-shortcut-title">{vi.shortcuts}</h2>
        <h2 className="mobile-shortcut-title">{vi.mobileShortcuts}</h2>
        <button aria-label={vi.close} onClick={() => setOpen(false)}>×</button>
      </div>
      <div className="shortcut-body">
        <div className="desktop-guide"><ShortcutGroups groups={vi.desktopShortcutGroups} /></div>
        <div className="mobile-guide"><ShortcutGroups groups={vi.mobileShortcutGroups} /></div>
      </div>
    </section>}
    <button className="shortcut-button" aria-label={vi.shortcuts} title={vi.shortcuts} aria-expanded={open} onClick={() => setOpen((value) => !value)}><KeyboardIcon /><span className="shortcut-button-label">{vi.help}</span></button>
  </div>;
}
