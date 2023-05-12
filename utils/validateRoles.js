import { User } from './collection';

const validateRole = async (roles) => {
  console.log(roles);
  const userRoles = await User.findOne(
    { email: req.user.email },
    { roles: 1, _id: 0 }
  );
  console.log(userRoles);
  roles.forEach((role) => {
    if (userRoles && userRoles.roles && userRoles.roles.indexOf(role) > -1) {
      return true;
    }
  });
  return false;
};

export { validateRole };
