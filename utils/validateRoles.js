import { User } from './collection';

const validateRole = async (roles, email) => {
  const userRoles = await User.findOne(
    { email },
    { roles: { $in: roles }, _id: 0 }
  );
  if (userRoles) return true;
  return false;
};

export { validateRole };
