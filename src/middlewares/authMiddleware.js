import { getSession } from "../models/session/SessionModel.js";
import { getOneAdmin, getUserByEmail } from "../models/user/UserModel.js";
import {
  accessJWTDecode,
  refreshJWTDecode,
  signAccessJWT,
} from "../utils/jwtHelper.js";

export const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // validate if accessJWT is valid
    const decoded = accessJWTDecode(authorization);
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

export const refreshAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // validate if refreshJWT is valid
    const decoded = refreshJWTDecode(authorization);
    if (decoded?.email) {
      // extract the email, get user by email
      const user = await getOneAdmin({
        email: decoded.email,
        refreshJWT: authorization,
      });
      if (user?._id) {
        // create new accessJWT and return
        const accessJWT = signAccessJWT({ email: user.email });

        return res.json({
          status: "success",
          accessJWT,
        });
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
