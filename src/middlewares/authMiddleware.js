import { getSession } from "../models/session/SessionModel.js";
import { getUserByEmail } from "../models/user/UserModel.js";
import { accessJWTDecode } from "../utils/jwtHelper.js";

const userAuth = async (req, res, next) => {
  try {
    console.log("in try");
    const { authorization } = req.headers;

    // validate if accessJWT is valid
    const decoded = accessJWTDecode(authorization);
    console.log(decoded);
    if (decoded?.email) {
      // check if exists in session table
      const tokenExist = await getSession({ token: authorization });
      if (tokenExist?._id) {
        // extract the email, get user by email
        const user = await getUserByEmail(decoded.email);
        if (user?._id) {
          // if everything true -> set user info to req obj and sent to next middleware
          user.password = undefined;
          req.userInfo = user;

          return next();
        }
      }
    }

    throw new Error("Invalid token, unauthorized!");
  } catch (error) {
    error.errorCode = 401;
    if (error.message.includes("jwt expired")) {
      error.errorCode = 403;
    }
    next(error);
  }
};

export default userAuth;
