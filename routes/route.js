import { Router } from "express";
const router = Router();

import * as controller from '../controllers/appController.js';
import Auth, { localVariables } from "../middleware/auth.js";
import { registerMail, resetPasswordMail } from "../controllers/mailer.js";

router.route('/register').post(controller.register);
router.route('/registerMail').post(registerMail);
router.route('/resetPasswordMail').post(resetPasswordMail);
router.route('/authentication').post(controller.verifyUser, (req, res) => res.end());
router.route('/login').post(controller.verifyUser, controller.login);

router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP);
router.route('createResetSession').get(controller.createResetSession);

router.route('/updateuser').put(Auth, controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);

export default router;