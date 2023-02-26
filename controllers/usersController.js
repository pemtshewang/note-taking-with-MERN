const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all user
// @route GET /users
// @access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({
      message: "No users found",
    });
  }
  res.json(users);
});

// @desc create all user
// @route POST /users
// @access private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  //checking for duplicates
  const duplicates = await User.findOne({ username }).lean().exec();

  if (duplicates) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }

  //hashing the password
  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject = { username, password: hashedPwd, roles };

  //Create and store the new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({
      message: `New user ${username} created`,
    });
  } else {
    res.status(400).json({
      message: `Invalid user data`,
    });
  }
});

// @desc updateUser all user
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
    const { _id, username, roles, active, password} = req.body;
    if(!_id || !username||!Array.isArray(roles)|| !roles.length || typeof(active) !== 'boolean'){
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    const user = await User.findById(_id).exec();
    if (!user){
        return res.status(400).json({
            message: "User not found"
        })
    }

    //checking for duplicates
    const duplicate = User.findOne({ username }).lean().exec()

    //Allow updates to the original user
    if(duplicate !== undefined && duplicate?._id !== _id){
      console.log( duplicate?._id !== _id);
        return res.status(409).json({
            message: "Invalid User"
        })
    }
    user.username = username;
    user.roles = roles;
    user.active = active;

    if(password){
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save();
    return res.json({
        message:`${updatedUser.user} updated`
    })
});

// @desc Delete user
// @route delete /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    if(!_id){
        return res.status(400).json({
            message:'User ID required'
        })
    }

    const notes = await Note.findOne({
     user: _id
    }).lean().exec();
    if(notes?.length){
        return res.status(400).json({message: 'User has assigned notes'});
    }
    const user = await User.findById(id).exec();
    if(!user){
        return res.status(400).json({
            message: "User not found"
        })
    }
    const result = await user.deleteOne();
    const reply = `Username ${result.username} with ID ${result._id} deleted`
    return res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
