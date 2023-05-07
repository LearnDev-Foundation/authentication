import User from '../model/User.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret } from '../config.js';
import otpGenerator from 'otp-generator';

export async function verifyUser(req, res, next){
    const { username } = req.method == "GET" ? req.query : req.body;

    let exist = await User.findOne({ username: { $eq: username } });
    if (!exist) {
        return res.status(404).json({ message: "User does not exist" });
    }
    next();
}

export async function register(req, res){
    
    const { username, password, email } = req.body;

    User.findOne({ email: email})
        .then(user => {
            if (user) {
                res.status(409).json({ message: "Email already in use" });
            } else {
                User.findOne({ username: username })
                    .then(user => {
                        if (user) {
                            res.status(409).json({ message: "Username already in use" });
                        } else {
                            const newUser = new User({
                                username: username,
                                password: password,
                                email: email
                            });
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    newUser.password = hash;
                                    newUser.save()
                                        .then(res.status(201).json({ message: "User registered successfully" }))
                                        .catch(err => res.status(500).json({ message: "User registration failed" }));
                                })
                            });
                        }
                    }).catch(err => {
                        res.status(500).json({ message: "An error occured" });
                    });
            }
        }).catch(err => {
            res.status(500).json({ message: "An error occured" });
        });

}

export async function login(req, res){
    
    const { username, password } = req.body;

    User.findOne({ username: username })
        .then(user => {
            bcrypt.compare(password, user.password)
                .then(isMatch => {

                    if (isMatch) {
                        // create jwt token
                        const token = jwt.sign({
                            id: user._id,
                            user: user.username
                        }, jwtSecret, { expiresIn : "24h"});
    
                        return res.status(200).send({
                            msg: "Login successful",
                            username: user.username,
                            token
                        })
                    } else {
                        res.status(400).json({ message: "Password incorrect" });
                    }
                })
                .catch(err => res.status(500).json({ message: "An error occured" }));
        })
        .catch(err => {
            res.status(404).json({ message: "Username not Found" })
        });
}

export async function getUser(req, res){
    
    const { username } = req.params;

    if (!username) {
        return res.status(403).json({ message: "Username not provided" });
    }

    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                res.status(501).json({ message: "User not found" });
            }else {
                const { password, ...rest } = Object.assign({}, user.toJSON());

                res.status(200).json(rest);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "An error occured" });
        });
}

export async function updateUser(req, res){
    
    // const id = req.query.id;
    const { id } = req.user;

    if (id) {
        const body = req.body;

        User.updateOne({ _id: id }, body)
            .then(user => {
                res.status(201).json({ message: "User updated successfully" });
            })
            .catch(err => {
                res.status(500).json({ message: "An error occured" });
            });
    } else {
        res.status(404).json({ message: "User not found" });
    }
}

export async function generateOTP(req, res){
    req.app.locals.OTP = await otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    res.status(201).send({ code: req.app.locals.OTP });
}

export async function verifyOTP(req, res){
    const { code } = req.query;

    if(parseInt(req.app.locals.OTP) == parseInt(code)){
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        res.status(201).send({ msg: 'OTP Verification Succesful'})
    }else {
        res.status(400).send({ error: "Invalid OTP" });
    }
}

export async function createResetSession(req, res){
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;
        res.status(201).send({ msg: "Access Granted" })
    } else {
        res.status(440).send({ error: "Session expired" })   
    }
}

export async function resetPassword(req, res){

    if(!req.app.locals.resetSession) {
        return res.status(440).send({ error: "Session expired" });
    } else {
        const { username, password } = req.body;
    
        User.findOne({ username })
            .then(user => {
                if (user) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            User.updateOne({ username: user.username }, { password: hash })
                                .then(user => {
                                    res.status(201).send({ msg: "Password reset successful" })
                                })
                                .catch(error => {
                                    res.status(500).send({ error: "Password reset failed" })
                                });
                        })
                    })
                } else {
                    res.status(404).send({ error: "User not found" })
                }
            })
            .catch(error => {
                res.status(500).send({ error: "An error occured" });
            });
    }


}