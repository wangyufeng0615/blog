import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return <IconBase {...props}><path d="M12 5v14M5 12h14" /></IconBase>
}

export function TrashIcon(props: IconProps) {
  return <IconBase {...props}><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></IconBase>
}

export function PauseIcon(props: IconProps) {
  return <IconBase {...props}><path d="M8 5v14M16 5v14" /></IconBase>
}

export function PlayIcon(props: IconProps) {
  return <IconBase {...props}><path d="m8 5 11 7-11 7V5Z" /></IconBase>
}

export function SaveIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5 4h12l2 2v14H5V4Zm3 0v6h8V4M8 20v-6h8v6" /></IconBase>
}

export function LoadIcon(props: IconProps) {
  return <IconBase {...props}><path d="M12 3v12m0 0-4-4m4 4 4-4M5 17v3h14v-3" /></IconBase>
}

export function UserIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="8" r="4" /><path d="M4.5 21c.8-5 3.3-7 7.5-7s6.7 2 7.5 7" /></IconBase>
}

export function ScoreIcon(props: IconProps) {
  return <IconBase {...props}><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></IconBase>
}

export function ClockIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></IconBase>
}

export function OrbIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="12" r="8" /><path d="M8 7.5c1-1 2.3-1.5 4-1.5" /></IconBase>
}
