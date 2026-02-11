// Niveaux de difficulté de l'IA - du débutant complet à l'expert redoutable

import type { DifficultyLevel, DifficultyConfig } from './types'

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, DifficultyConfig> = {
  beginner: {
    name: 'Débutant',
    elo: 800,
    depth: 5,
    movetime: 100,    // réfléchit très peu (100ms)
    skillLevel: 1,
  },
  casual: {
    name: 'Facile',
    elo: 1200,
    depth: 8,
    movetime: 500,
    skillLevel: 5,
  },
  intermediate: {
    name: 'Moyen',
    elo: 1600,
    depth: 12,
    movetime: 1000,
    skillLevel: 10,
  },
  advanced: {
    name: 'Difficile',
    elo: 2000,
    depth: 16,
    movetime: 2000,
    skillLevel: 15,
  },
  expert: {
    name: 'Expert',
    elo: 2400,
    depth: 20,
    movetime: 3000,   // réfléchit longuement (3 secondes)
    skillLevel: 20,
  },
}

// Retourne la configuration d'un niveau donné
export function getDifficultyConfig(level: DifficultyLevel): DifficultyConfig {
  return DIFFICULTY_LEVELS[level]
}

// Retourne la liste de tous les niveaux disponibles
export function getAllDifficultyLevels(): DifficultyLevel[] {
  return Object.keys(DIFFICULTY_LEVELS) as DifficultyLevel[]
}
