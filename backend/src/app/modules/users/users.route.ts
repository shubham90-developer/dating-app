import express from "express";

import { upload } from "../../config/cloudinary";
import {
  createUsers,
  deleteUsersById,
  getAllUsers,
  updateUsersById,
  UsersById,
} from "./users.controller";

const router = express.Router();

router.post("/", upload.array("profileImages", 6), createUsers);

router.get("/", getAllUsers);

router.get("/:id", UsersById);

router.put("/:id", upload.array("profileImages", 6), updateUsersById);

router.delete("/:id", deleteUsersById);

export const usersRouter = router;
