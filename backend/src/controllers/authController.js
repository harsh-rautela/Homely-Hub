//  authController.js  -  the security guard of our app

//    signup / login / logout        - getting in and out
//    protect                        - the guard at the gate
//    updateMe / updatePassword      - changing my own details
//    forgotPassword / resetPassword - I lost my password
//    check                          - who is logged in?

import { User } from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import imagekit from "../utils/ImagekitIO.js";
import { forgotPasswordMailGenContent, sendMail } from "../utils/mail.js";
import {
  createSendToken,
  defaultAvatarUrl,
  filterObj,
} from "../utils/token.js";

// 1. SIGNUP - make new account

const signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      avatar: { url: req.body.avatar || defaultAvatarUrl(req.body.name) },
    });
    createSendToken(newUser, 201, res);
  } catch (error) {
    const duplicatedField = Object.keys(error.keyPattern || {})[0];
    const message = duplicatedField
      ? `An account with that ${duplicatedField} already exists`
      : error.message;

    res.status(400).json({ message });
  }
};

// 2. LOGIN - check email + password, then give a token

const login = async (req, res) => {
  try {
    // Take out the two fields we need from the body
    const { email, password } = req.body;
    // Nothing typed? Stop here, no point asking the database.
    if (!email || !password) {
      throw new Error("Please Provide email and password");
    }
    // Find that user. Normally the password never comes out
    // (select:false in the model). The +password says 'this
    // one time, bring it too' - we need it to compare.
    const user = await User.findOne({ email:req.body.email }).select("+password");
     
    // Two checks in one if:
    //   no such user   OR   the password does not match
    // Both give the SAME message on purpose. If we said 'no
    // such email', anyone could find out which emails are
    // registered on our site.
    
    if (
      !user ||
      (await user.comparePassword(password, user.password)) === false
    ) {
      throw new Error("Incorrect email or password");
    }
    // Correct. 200 = ok. Token goes back in a cookie.
    createSendToken(user, 200, res);
  } catch (error) {
    // 401 = 'I do not know who you are'
    console.log(error.message)
    res.status(401).json({ status: "fail", message: error?.message });
  }
};

// 3. LOGOUT - throw the cookie away

// A token cannot be cancelled, and we cannot reach into the
// user's browser. So we send a NEW cookie with the same name
// that is already expired. The browser deletes it at once.
const logout = (req, res) => {
  const cookieOptions = {
    // new Date(0) is 1 Jan 1970 - already past, so it dies now
    expires: new Date(0),
    httpOnly: true,
    path: "/",
  };

  // These settings must match the login cookie exactly,
  // otherwise the browser thinks it is a different cookie
  // and the real one stays alive.
  if (process.env.NODE_ENV === "production") {
    cookieOptions.sameSite = "none";
    cookieOptions.secure = true;
  } else {
    cookieOptions.sameSite = "lax";
    cookieOptions.secure = false;
  }

  // Same name 'jwt', so it overwrites the real one.
  // The word 'loggedout' is a marker - protect ignores it.
  res.cookie("jwt", "loggedout", cookieOptions);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// 4. PROTECT - the guard. THE most important one today.

// This is a middleware. It runs BEFORE the real
// work and decides whether the request may go ahead.
// It checks 4 things:  is there a token? is it real? does
// that user still exist? did he change his password since?
const protect = async (req, res, next) => {
  try {
    console.log("inside protect ")
    // Step 1 - find the token. It can come in 2 places.
    let token;
    // Place 1 - the Authorization header, used by Postman
    // and mobile apps. It looks like:  Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // split on the space, [1] is the part after 'Bearer'
      token = req.headers.authorization.split(" ")[1];
      // Place 2 - the cookie, which the browser sends by itself.
      // We skip 'loggedout' - that is our own logout marker.
    } else if (req.cookies.jwt && req.cookies.jwt !== "loggedout") {
      token = req.cookies.jwt;
    }

    // Step 2 - no token at all means not logged in.
    if (!token) {
      throw new Error("You are not logged in!! Please login to access");
    }

    // Step 3 - verify does 2 jobs together:
    //   is the signature made with OUR secret? (not a fake)
    //   has it expired?  (JWT_EXPIRES_IN)
    // If either fails it throws, and catch below sends 401.
    // decoded is what was inside: { id, iat, exp }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4 - the token is real, but is the user still there?
    // The account may have been deleted after the token was
    // given. Real ticket, but the person is gone.
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error("the user belonging to the token dosen't exists");
    }

    // Step 5 - the stolen token case. If someone stole your
    // token and you then changed your password, the old token
    // must stop working. iat = 'issued at', when the token was
    // made. This method came from userModel.js on day 2.
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("user recently changed the password, Please login again");
    }

    // Step 6 - all checks passed. Stick the user on the
    // request, so every function after this can just say
    // req.user without asking the database again.
    req.user = currentUser;

    // 'guard is happy, carry on'. Without next() the request
    // would hang forever.
    next();
  } catch (error) {
    console.log(`from protect ${error.message}`)
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 5. UPDATE ME - change my name, phone or photo

const updateMe = async (req, res) => {
  try {
    const filteredBody = filterObj(req.body, "name", "phoneNumber", "avatar");

    const sentPhoto =
      req.body.avatar !== undefined && String(req.body.avatar).trim() !== "";

    const currentAvatarUrl = (req.user.avatar && req.user.avatar.url) || "";
    const usingInitials = currentAvatarUrl.includes("ui-avatars.com");

    if (sentPhoto) {
      const uploadResponse = await imagekit.upload({
        file: req.body.avatar,
        fileName: `avatar_${Date.now()}.jpg`,
        folder: "avatars",
      });
      filteredBody.avatar = {
        public_id: uploadResponse.fileId,
        url: uploadResponse.url,
      };
    } else if (
      req.body.avatar !== undefined ||
      (filteredBody.name && usingInitials)
    ) {
      filteredBody.avatar = {
        url: defaultAvatarUrl(filteredBody.name || req.user.name),
      };
    } else {
      delete filteredBody.avatar;
    }
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      data: {
        user: updateUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

// 6. UPDATE PASSWORD - I know my old password, change it

const updatePassword = async (req, res) => {
  try {
    // +password again, because we must compare the old one.
    const user = await User.findById(req.user.id).select("+password");

    // He is already logged in, so why ask the old password?
    // Because he may have left the laptop open and anyone
    // passing by could take over the account.
    if (
      !(await user.comparePassword(req.body.passwordCurrent, user.password))
    ) {
      const authError = new Error("Your current password is wrong");
      authError.statusCode = 401;
      throw authError;
    }

    // Set the new password on the user object...
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    // ...then save(). This is important: save() runs the
    // pre-save hook, so the new password gets hashed.
    // findByIdAndUpdate would NOT run it and the password
    // would be stored as plain text. For passwords: save().
    await user.save();

    // A fresh token, because the old one now counts as 'made
    // before the password change' and would be rejected.
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// 7. FORGOT PASSWORD - mail me a reset link

const forgotPassword = async (req, res) => {
  // The SAME reply whether the email exists or not. If we said
  // 'no such email', a stranger could test thousands of emails
  // and find out who is registered here.
  const genericResponse = {
    status: "success",
    message: "If that email is registered, a reset link has been sent",
  };

  try {
    const user = await User.findOne({ email: req.body.email });

    // No such user - reply normally and quietly stop.
    if (!user) return res.status(200).json(genericResponse);

    // From userModel.js. It gives back the plain token
    // for the email, and stores only its HASH in the database.
    // So a stolen database cannot reset anybody's password.
    const resetToken = user.createPasswordResetToken();
    // Skip the model checks this once - we are only adding a
    // token, and it would ask for passwordConfirm again.
    await user.save({ validateBeforeSave: false });

    // The link the user will click. It points at the FRONTEND
    // address, with the plain token at the end.
    const resetURL = `${process.env.ORIGIN_ACCESS_URL}/user/resetPassword/${resetToken}`;

    // A second try inside the first one, only for the email.
    try {
      await sendMail({
        email: user.email,
        subject: "Reset your Password (valid for 10 mins)",
        mailGenContent: forgotPasswordMailGenContent(user.name, resetURL),
      });
      // Mail failed. The user has no link, but a reset token is
      // now sitting in the database doing nothing. Clean it up.
    } catch (mailError) {
      const userWithToken = await User.findById(user._id).select(
        "+passwordResetToken +passwordResetExpires",
      );
      userWithToken.passwordResetToken = undefined;
      userWithToken.passwordResetExpires = undefined;
      await userWithToken.save({ validateBeforeSave: false });
      throw mailError;
    }

    res.status(200).json(genericResponse);
  } catch (error) {
    console.error("forgotPassword failed:", error);
    res.status(500).json({
      status: "fail",
      message: "Could not send the reset email, please try again later",
    });
  }
};

// 8. RESET PASSWORD - use the link from that email

const resetPassword = async (req, res) => {
  try {
    // The token comes in the URL. The database has only the
    // HASH, so we hash what arrived and look for a match.
    // Same input always gives the same hash.
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // One search, two conditions: the hash must match AND the
    // expiry must still be in the future. $gt = greater than.
    // This is how the 10 minute limit is enforced.
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    // Wrong token or time over - same message for both.
    if (!user) {
      throw new Error("Token is invalid or expired");
    }

    // Set the new password and confirm
    ((user.password = req.body.password),
      (user.passwordConfirm = req.body.passwordConfirm));
    // Wipe the token so the same link cannot be used twice
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // save() again - the hook hashes the new password
    await user.save();

    // Log him in straight away with a new token
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

// 9. CHECK - who is logged in?

// The smallest one. It does no database work at all - protect
// already put the user on req. The frontend calls this after
// every page refresh, because React forgets everything: show
// the name and photo, or show the Login button.
const check = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Logged In",
      user: req.user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "UnAuthorised",
    });
  }
};

// Send all 9 out. userRoutes.js imports them and decides which
// address calls which one.
export {
  signup,
  login,
  logout,
  protect,
  updateMe,
  resetPassword,
  forgotPassword,
  updatePassword,
  check,
};
