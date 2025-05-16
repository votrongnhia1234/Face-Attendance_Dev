export const hasRole = (auth, roles) => {
  if (!auth) return false;
  return Array.isArray(roles) ? roles.includes(auth.role) : auth.role === roles;
};