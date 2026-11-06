import { useEffect, useState } from 'react';
import { vi } from '../i18n/vi';

const groups = [
  { title: 'Chung', items: [['Hoàn tác', 'Ctrl+Z'], ['Làm lại', 'Ctrl+⇧+Z'], ['Phóng to / thu nhỏ', '+ / −'], ['Chọn nhiều node', '⇧+Kéo']] },
  { title: 'Khi chọn node hoặc cạnh', items: [['Sửa tên node', 'Nhấp đúp'], ['Sửa trọng số cạnh', 'Nhấp đúp'], ['Xóa phần tử', 'Backspace']] },
  { title: 'Chạy thuật toán', items: [['Bước trước / sau', '← / →'], ['Chạy / dừng', 'Space'], ['Về đầu / cuối', 'Home / End']] },
] as const;

function KeyboardIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M6 9h1M10 9h1M14 9h1M18 9h.1M6 13h1M10 13h1M14 13h4M6 16h8"/></svg>;
}

export function ShortcutHelp() {
  const [open, setOpen] = useState(false);
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
      <div className="shortcut-heading"><h2>{vi.shortcuts}</h2><button aria-label={vi.close} onClick={() => setOpen(false)}>×</button></div>
      {groups.map((group) => <div className="shortcut-group" key={group.title}>
        <h3>{group.title}</h3>
        {group.items.map(([label, keys]) => <div className="shortcut-row" key={label}><span>{label}</span><kbd>{keys}</kbd></div>)}
      </div>)}
    </section>}
    <button className="shortcut-button" aria-label={vi.shortcuts} title={vi.shortcuts} aria-expanded={open} onClick={() => setOpen((value) => !value)}><KeyboardIcon /></button>
  </div>;
}
