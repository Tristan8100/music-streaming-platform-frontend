// lib/genre-colors.ts

export const genreColors: Record<string, { bg: string; text: string; border: string }> = {
  // Pop
  pop: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" },
  
  // Rock
  rock: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  
  // Hip-Hop / Rap
  "hip-hop": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  "hip hop": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  rap: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  
  // Jazz
  jazz: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  
  // Electronic / EDM
  electronic: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  edm: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  
  // R&B
  "r&b": { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200" },
  rnb: { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200" },
  
  // Country
  country: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
  
  // Reggae
  reggae: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  reggaeton: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  
  // Classical
  classical: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
  
  // Soul / Blues
  soul: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
  blues: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
  
  // Latin
  latin: { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" },
  salsa: { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" },
  
  // Default
  default: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
};

export function getGenreColor(genre: string): typeof genreColors.default {
  return genreColors[genre.toLowerCase()] || genreColors.default;
}
