export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const LOGIN_PATHNAME = '/login' as const;

export const REGISTER_PATHNAME = '/register' as const;

export const USER_TOKEN_NAME = 'userToken' as const;

// Color selector colors
export const COLORS = [
  '#e5e7eb',
  '#f43f5e',
  '#fb923c',
  '#facc15',
  '#84cc16',
  '#10b981',
  '#22d3ee',
  '#3b82f6',
  '#8b5cf6',
  '#d946ef',
] as const;

export const FAVORITE_COLOR = '#facc15';

export const TAG_BACKGROUND_OPACITY_HEX_CODE = 'CC' // 'CC' = 80% - '99' = 60%
