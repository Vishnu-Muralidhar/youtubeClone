import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async function(userId){
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false}) //else will try to validate all the columns in User

        return {accessToken, refreshToken}
    } catch(error){
        throw new ApiError(500, "Error in generating tokens")
    }
}



const registerUser = asyncHandler(async (req, res) => {
  // get data from the request
  // validation
  // check if user already exists
  //check for image and upload on cloudinary
  // create user object and create entry in db
  // remove password and refresh token filed from response
  // check for user creation
  // return resonse

  const { username, email, fullName, password } = req.body;
  console.log(username, email, fullName, password);
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path; //from multer middleware
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const cloudinaryResponse = await uploadOnCloudinary(avatarLocalPath);
  const cloudinaryCoverImageResponse =
    await uploadOnCloudinary(coverImageLocalPath);
  if (!cloudinaryResponse) {
    throw new ApiError(500, "Error in uploading image on cloudinary");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    password,
    avatar: cloudinaryResponse?.url,
    coverImage: cloudinaryCoverImageResponse?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //we dont want these fields in response
  );
  if (!createdUser) {
    throw new ApiError(500, "Error in creating user");
  }
  
  return res.status(201).json(
    new ApiResponse(201,  createdUser, "User registered successfully")
  );
});


const loginUser = asyncHandler(async (req, res)=>{
    const{email, username, password} = req.body
    if(!username || !email){
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or:[{username}, {email}]
    })

    if (!user){
        throw new ApiError(404, "User not found")
    }

    const isPassCorrect = await user.isPasswordCorrect(password)
    if(!isPassCorrect){
        throw new ApiError(401, "Password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedinUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, {
                user: loggedinUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"))
})


const logoutUser = asyncHandler(async (req, res)=>{
    const userId = req.user._id
    User.findByIdAndUpdate(userId, {
        $set: {
            refreshToken: undefined
        },
            new: true // to get the new undefined value
        
    })
        const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})


const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.headers("Authorization")?.split(" ")[1] || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }
try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Unauthorized request")
        }
        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresh token is expired")
        }
        const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newrefreshToken, options).json(new ApiResponse(200, {accessToken,newrefreshToken}, "Access token refreshed successfully"))
    
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token")
}})


export {registerUser, loginUser, logoutUser , refreshAccessToken};



