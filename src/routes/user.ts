import { Router } from "express";
import {
  authUser,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteAccount,
} from "../controllers/user";

const user = Router();

user.route("/auth").post(authUser);
user.route("/user").get(getUsers).post(createUser);
user.route("/user/:id").get(getUser).put(updateUser).delete(deleteAccount);

export default user;
