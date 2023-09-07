import express from "express"
import { forgotPassword, getAllUsers, getSingleUser, getUserDetails, loginUser, logoutUser, registerUser, resetPassword, updateUserPassword, updateUserProfile, updateUserRole,deleteUser } from "../controllers/userController.js"
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js"

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/password/update").put(isAuthenticatedUser,updateUserPassword)
router.route("/me/update").put(isAuthenticatedUser,updateUserProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser).put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)

export default router