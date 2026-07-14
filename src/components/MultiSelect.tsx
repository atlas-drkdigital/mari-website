'use client'

import { useEffect, useRef, useState } from 'react'

// Multi-Select Checkbox Dropdown — ported from ../v1-static-homepage/assets/multiselect.js.
// A button trigger + checkbox panel. The trigger's label updates live: none checked ->
// placeholder; 1-2 checked -> names joined; 3+ checked -> first 2 names + "+N more".
type MultiSelectProps = {
  id: string
  label: string
  placeholder: string
  name: string
  options: string[]
}

export function MultiSelect({ id, label, placeholder, name, options }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState<string[]>([])
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggleOption = (value: string) =>
    setChecked((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))

  const labelText =
    checked.length === 0 ? placeholder : checked.length <= 2 ? checked.join(', ') : `${checked.slice(0, 2).join(', ')} +${checked.length - 2} more`

  return (
    <div className="flex flex-1 flex-col gap-12">
      <label id={`${id}-label`} className="text-caption-label uppercase tracking-[1.5px] text-action-primary">{label}</label>
      <div ref={rootRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label`}
          onClick={() => setOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between gap-12 rounded-xs border border-action-primary bg-bg-surface px-24 py-16 text-left text-[16px] lg:text-body-large transition-colors duration-300 ease-in-out hover:bg-action-primary/5 ${checked.length ? 'text-text-primary' : 'text-text-secondary'}`}
        >
          <span className="truncate">{labelText}</span>
          <span aria-hidden="true" className="block size-[10px] shrink-0 bg-action-primary [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
        </button>
        {open && (
          <div className="absolute inset-x-0 top-full z-10 mt-4 max-h-[280px] overflow-y-auto rounded-xs border border-action-primary bg-bg-surface shadow-card">
            <fieldset className="flex flex-col divide-y divide-border-default">
              <legend className="sr-only">{label}</legend>
              {options.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-12 px-24 py-12 transition-colors duration-300 ease-in-out hover:bg-action-primary/5">
                  <input
                    type="checkbox"
                    name={name}
                    value={option}
                    checked={checked.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="accent-action-primary"
                  />
                  <span className="text-[16px] lg:text-body-large text-text-primary">{option}</span>
                </label>
              ))}
            </fieldset>
          </div>
        )}
      </div>
    </div>
  )
}
