import Employee from "../models/Employee.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API is working!",
  });
};

export const updateEmployee = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedEmployee._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can delete your account only!"));
  }

  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json("Employee has been deleted...");
  } catch (error) {
    next(error);
  }
};
