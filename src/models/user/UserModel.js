import UserSchema from "./UserSchema.js";

// create
export const createUser = (userObj) => {
  return UserSchema(userObj).save();
};

// read
export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};

export const getOneAdmin = (filter) => {
  return UserSchema.findOne(filter);
};

// get all user who are not admin
export const getAllStudents = (filter) => {
  const selectedProperties = {
    _id: 1,
    status: 1,
    role: 1,
    fname: 1,
    lname: 1,
    email: 1,
    phone: 1,
    createdAt: 1,
  };

  return UserSchema.find(filter, selectedProperties);
};

// add refresh jwt
export const updateRefreshJWT = async (email, refreshJWT) => {
  return await UserSchema.findOneAndUpdate({ email }, { refreshJWT });
};
