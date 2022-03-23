const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../modles/userModel");
const { registerUser } = require("../controllers/userController");

// exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
//     const {token} = req.cookies;
//     if(!token) return next(new ErrorHandler("Please Login to acces this resource",401))

//     // decode the data useing jwt
//     const decodeData = jwt.verify(token,process.env.JWT_SECRET);

//     req.user = await User.findById(decodeData.id);
//     next();
// });

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // ERROR

    console.log("req.user is ");
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      // it was normal user
      return next(
        new ErrorHandler(
          `Role :  ${req.user.role} is not allowed to access this resource`
        )
      );
    }
    next();
  };
};
