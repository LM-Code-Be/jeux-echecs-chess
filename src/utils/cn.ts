// Fusionne des classes Tailwind en évitant les conflits (ex: "p-2 p-4" → "p-4")

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
