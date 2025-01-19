// utils.ts
export const getSavedPath = (): string => localStorage.getItem("currentPath") || "/user";
