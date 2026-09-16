// ============================================================
//  token.js  -  the small helpers used by login and signup
// ============================================================
//
//  1. signinToken
//     After you log in, the server must remember you. But the
//     server does NOT keep a list of who is logged in. Instead
//     it gives you a token - like a movie ticket. The ticket
//     has your id written on it, and it is signed with a secret
//     only the server knows. Next time you come, you show the
//     ticket, the server checks the signature, and knows it is
//     really you. A fake ticket fails the check.
//
//  2. createSendToken
//     Making the ticket is not enough - we must hand it over.
//     This does the full job: make the token, put it in a
//     cookie, hide the password, and send the reply. Signup,
//     login, update-password and reset-password ALL end the
//     same way, so instead of writing those 15 lines four
//     times, we write them once here.
//
//  3. defaultAvatarUrl
//     A new user has no profile photo. Rather than show an
//     empty grey box, we use a free website that draws a circle
//     with the first letters of their name in it.
//
//  4. filterObj
//     When a user updates their profile, we must NOT trust
//     whatever the browser sends. If we did, someone could send
//     role: "admin" and make themselves an admin. So we keep
//     only the fields we allow and throw the rest away.
//     Rule to remember: never trust req.body directly.
//
// ============================================================

// jsonwebtoken is the library that makes and checks the ticket.
import jwt from "jsonwebtoken";


// ------------------------------------------------------------
// 1. MAKE THE TOKEN
// ------------------------------------------------------------
// (id) => the user's database id. That is all we put inside.
// We never put the password or email in a token, because
// anyone holding a token can read what is inside it. It cannot
// be CHANGED without the secret, but it CAN be read.
const signinToken = (id) => {
  // jwt.sign takes three things:
  //   { id }              -> what to write on the ticket
  //   JWT_SECRET          -> the secret used to sign it. It is
  //                          in .env, never in the code, and
  //                          never on GitHub.
  //   expiresIn           -> after this time the ticket is dead
  //                          and the user must log in again.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


// ------------------------------------------------------------
// 2. MAKE THE TOKEN, PUT IT IN A COOKIE, SEND THE REPLY
// ------------------------------------------------------------
// user       -> the user we just created or just logged in
// statusCode -> 201 for "created" (signup), 200 for "ok" (login)
// res        -> the reply object, so we can send it back
const createSendToken = (user, statusCode, res) => {
  // Step 1 - make the ticket for THIS user.
  // user._id is the id mongodb gave them.
  const token = signinToken(user._id);

  // Step 2 - the rules for the cookie.
  const cookieOptions = {
    // When should the browser throw this cookie away?
    // Date.now() is right now in milliseconds. Then
    // days * 24 hours * 60 minutes * 60 seconds * 1000 turns
    // JWT_COOKIE_EXPIRES_IN (a number of days) into milliseconds.
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    // httpOnly: true = JavaScript in the browser CANNOT read
    // this cookie. Only the browser can send it back to us.
    // This stops a bad script on the page from stealing the
    // token. This one line is real security, not decoration.
    httpOnly: true,

    // sameSite decides whether the cookie is sent when the
    // request comes from a different website address.
    // On the live site the frontend and backend sit on
    // different addresses, so we need "none".
    // On our laptop both are localhost, so "lax" is fine.
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

    // secure: true = only send this cookie over https.
    // On the laptop we use plain http, so it must be false
    // there, otherwise the cookie would never arrive.
    secure: process.env.NODE_ENV === "production",
  };

  // Step 3 - attach the cookie to the reply.
  // "jwt" is just the name we chose for the cookie.
  res.cookie("jwt", token, cookieOptions);

  // Step 4 - hide the password before sending the user back.
  // undefined means "there is nothing here", so it does not go
  // out in the reply. Note: we only changed the copy in memory,
  // we did NOT save, so the real password in the database is
  // untouched.
  user.password = undefined;

  // Step 5 - send everything back to the browser.
  // We send the token in the reply AND in the cookie, so that
  // both a browser and a tool like Postman can work with it.
  res.status(statusCode).json({
    status: "Success",
    token,
    user,
  });
};


// ------------------------------------------------------------
// 3. A READY-MADE PROFILE PICTURE
// ------------------------------------------------------------
// Builds a web address that draws a circle with the person's
// initials. Nothing is uploaded and nothing is stored - the
// picture is made by that website from the address itself.
const defaultAvatarUrl = (name) =>
  "https://ui-avatars.com/api/?name=" +
  // encodeURIComponent makes the name safe for a web address.
  // A space is not allowed in a url, so "Rohit Kumar" becomes
  // "Rohit%20Kumar". Without this the address would break.
  // (name || "User") means: if there is no name, use "User".
  encodeURIComponent(name || "User") +
  // background = circle colour, color = text colour,
  // size = 256 pixels, bold = thick letters.
  "&background=0e8b53&color=fff&size=256&bold=true";


// ------------------------------------------------------------
// 4. KEEP ONLY THE ALLOWED FIELDS
// ------------------------------------------------------------
// obj             -> what the browser sent us (req.body)
// ...allowedFeilds -> the names we agree to accept.
// The three dots collect every extra argument into a list. So
// filterObj(req.body, "name", "phoneNumber") gives us
// allowedFeilds = ["name", "phoneNumber"].
const filterObj = (obj, ...allowedFeilds) => {
  // Start with an empty box.
  let newObj = {};

  // Object.keys(obj) gives the list of field NAMES that came in,
  // for example ["name", "email", "role"].
  // forEach runs the code once for each name. el is one name.
  Object.keys(obj).forEach((el) => {
    // Is this name in our allowed list?
    // If yes, copy that one field into the new box.
    // If no, we simply ignore it - so "role" never gets through.
    if (allowedFeilds.includes(el)) newObj[el] = obj[el];
  });

  // Hand back the clean box. Only safe fields are inside.
  return newObj;
};


// Send all four out so authController.js can import them.
// The names inside the braces must match exactly when imported.
export { signinToken, createSendToken, defaultAvatarUrl, filterObj };
