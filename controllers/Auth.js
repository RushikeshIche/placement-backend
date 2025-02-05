const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const ErrorHandler = require("../utils/error");

// // sendotp
// exports.SendOTP = async (req, res) => {
//     try {
//         // fetch email
//         const { email:lowerCaseEmail } = req.body;

//         const email = lowerCaseEmail.toLowerCase();

//         console.log(req.body)

//         // validate email
//         const checkUserPresent = await User.findOne({ email });

//         if (checkUserPresent) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Email already exits",
//             })
//         }
//         // generate otp
//         var otp = OtpGenenrator.generate(6, {
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//             specialChars: false,
//         });

//         // console.log("otp generated :", otp);

//         // check unique otp
//         const result = await OTP.findOne({ otp: otp });

//         while (result) {

//             otp = OtpGenenrator.generate(6, {
//                 upperCaseAlphabets: false,
//                 lowerCaseAlphabets: false,
//                 specialChars: false,
//             });

//             const result = await OTP.findOne({ otp: otp });
//         }


//         const otpPayload = { email, otp };

//         // create an entry in db 
//         const otpbody = await OTP.create(otpPayload);

//         console.log(otpbody)

//         // return res succuessful
//         res.status(200).json({
//             success: true,
//             message: "OTP send to your email successfully",
//             otp,
//         })

//     } catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             success: false,
//             message: "Failed to send otp",

//         })

//     }


// }


// // signup
// exports.Signup = async (req, res) => {
//     try {
//         //data fetch req body
//         const {
//             email:lowerCaseEmail,
//             password,
//             confirmPassword,
//             otp
//         } = req.body


//         const email = lowerCaseEmail.toLowerCase();

//         console.log(req.body)

//         // validate 
//         if (!email || !password || !confirmPassword || !otp) {
//             return res.status(403).json({
//                 success: false,
//                 message: "all fields are required"
//             })
//         }

//         // password match confirm
//         if (password !== confirmPassword) {
//             return res.status(403).json({
//                 success: false,
//                 message: "passowrd and confirm password should be same"
//             })
//         }

//         // check user already exist or not
//         const existuser = await User.findOne({ email })
//         if (existuser) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Email already exist"
//             })
//         }

//         // generate otp

//         // find recent otp
//         const recentotp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1) || [];

//         console.log("recentotp", recentotp);

//         if (recentotp.length === 0) {
//             return res.status(403).json({
//                 success: false,
//                 message: "otp-not-found"
//             })
//         }
//         else if (otp !== recentotp.otp) {
//             return res.status(403).json({
//                 success: false,
//                 message: "otp-did not match"
//             })
//         }

//         // hash pass
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // create user entry
//         const user = await User.create({
//             email,
//             password: hashedPassword,
//         })

//         return res.status(200).json({
//             success: true,
//             message: "user sign up successfully",
//             user
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({
//             success: false,
//             message: "failed to signup"
//         })
//     }
// }

// // loginj

// exports.login = async (req, res, next) => {
//   try {
//     // fetch data from body
//     const { email:lowerCaseEmail, password } = req.body;

//     const email = lowerCaseEmail.toLowerCase();

//     // validate data
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "all fields are required",
//       });
//     }

//     //if user exist
//     let user = await User.findOne({ email });

//     if (!user) {
//       return next(new ErrorHandler("Email not found", 404));
//     }

//     //generate JWT, after password matching
//     if (await bcrypt.compare(password, user.password)) {
//       const payload = {
//         email: user.email,
//         id: user.id,
//         accountType: user.accountType,
//       };

//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: "48h",
//       });
//       user = user.toObject();
//       user.token = token;
//       user.password = undefined;

//       //create cookie for user sent to client

//       res.cookie("token", token, {
//         expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         httpOnly: false,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//       });

//       return res.status(200).json({
//         success: true,
//         message: "User Logged In Successfully",
//         data: user,
//         token,
//       });
//     } else {
//       return res.status(403).json({
//         success: false,
//         message: "password do not match",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     next(error);
//     return res.status(403).json({
//       success: false,
//       message: "error in log in",
//     });
//   }
// };




exports.createFormEntry = async (req, res) => {
  try {
    const {
      name,
      personalEmail,
      collegeEmail,
      branch,
      tenthMarks,
      twelfthMarks,
      currentCgpa,
      mobileNumber,
      btechOrMtech,
      Sgpa,
      tenthPassYear,
      twelfthPassYear,
      backlogsCurrent,
      resume
    } = req.body;

    const requiredFields = [
      'name', 'personalEmail', 'collegeEmail', 'branch',
      'tenthMarks', 'twelfthMarks', 'currentCgpa', 
      'mobileNumber', 'btechOrMtech', 'tenthPassYear', 
      'twelfthPassYear', 'resume'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required.` });
      }
    }

    // Create a new form entry
    const newFormEntry = new Form({
      name,
      personalEmail,
      collegeEmail,
      branch,
      tenthMarks,
      twelfthMarks,
      currentCgpa,
      mobileNumber,
      btechOrMtech,
      Sgpa,
      tenthPassYear,
      twelfthPassYear,
      backlogsCurrent,
      resume
    });

    await newFormEntry.save();

    res.status(201).json({
      message: 'Form entry created successfully.',
      formEntry: newFormEntry
    });
  } catch (error) {
    console.error('Error creating form entry:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

