'use client'

interface EditorSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  defaultValue: number
  onChange: (value: number) => void
}

export default function EditorSlider({
  label,
  value,
  min,
  max,
  step = 1,
  defaultValue,
  onChange,
}: EditorSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  const trackBackground = `linear-gradient(to right, rgba(250,234,77,0.4) ${percentage}%, #454546 ${percentage}%)`

  return (
    <div className="flex flex-col gap-1 px-3 py-1.5">
      <div className="flex items-center justify-between">
        <span
          className="text-xs text-neutral-300 font-mono select-none cursor-pointer"
          onDoubleClick={() => onChange(defaultValue)}
          title="Double-click to reset"
        >
          {label}
        </span>
        <span className="text-xs text-primary font-mono tabular-nums min-w-[2rem] text-right">
          {value}
        </span>
      </div>
      <input
        type="range"
        className="editor-slider w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: trackBackground }}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  )
}
