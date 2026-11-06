import { useRef, type ChangeEvent } from 'react';
import { vi } from '../i18n/vi';
export function ImportExport({onText,trigger}:{onText:(text:string)=>void;trigger:(open:()=>void)=>void}){const ref=useRef<HTMLInputElement>(null);trigger(()=>ref.current?.click());const change=(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];if(file)void file.text().then(onText);event.target.value='';};return <input ref={ref} className="sr-only" type="file" accept="application/json,.json" aria-label={vi.importFile} onChange={change}/>}
