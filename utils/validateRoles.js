const validateRole = async (roles, userRoles) => {
  userRoles.forEach((userRole) => {
    if (roles.indexOf(userRole) > -1) return true;
  });
  return false;
};

export { validateRole };
