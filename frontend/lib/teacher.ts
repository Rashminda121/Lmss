export const isLecturer = (userRole?: string | null) => {
  return userRole === "lecturer" || userRole === "admin";
};
