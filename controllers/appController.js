import User from '../model/User.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret } from '../config.js';

export async function verifyUser(req, res, next){
    const { username } = req.method == "GET" ? req.query : req.body;

    let exist = await User.findOne({ username: username });
    if (!exist) {
        return res.json({ message: "User does not exist" });
    }
    next();
}

export async function register(req, res){
    
    const { username, password, profile, email } = req.body;

    User.findOne({ email: email})
        .then(user => {
            if (user) {
                res.json({ message: "Email already in use" });
            } else {
                User.findOne({ username: username })
                    .then(user => {
                        if (user) {
                            res.json({ message: "Username already in use" });
                        } else {
                            const newUser = new User({
                                username: username,
                                password: password,
                                profile: profile || "",
                                email: email
                            });
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    newUser.password = hash;
                                    newUser.save()
                                        .then(res.json({ message: "User registered successfully" }))
                                        .catch(err => res.json({ message: "User registration failed" }));
                                })
                            });
                        }
                    })
            }
        }).catch(err => {
            res.json({ message: "An error occured" });
        });

}

export async function login(req, res){
    
    const { username, password } = req.body;

    User.findOne({ username: username })
        .then(user => {
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    // create jwt token
                    const token = jwt.sign({
                        id: user._id,
                        username: user.username,
                    }, jwtSecret, { expiresIn : "24h"});

                    return res.send({
                        msg: "Login successful",
                        username: user.username,
                        token
                    })
                })
                .catch(err => res.json({ message: "Password incorrect" }));
        })
        .catch(err => {
            res.json({ message: "Username not Found" })
        });
}

export async function getUser(req, res){
    res.json('getUser Route');
}

export async function updateUser(req, res){
    res.json('updateUser Route');
}

export async function generateOTP(req, res){
    res.json('generateOTP Route');
}

export async function verifyOTP(req, res){
    res.json('verifyOTP Route');
}

export async function createResetSession(req, res){
    res.json('createResetSession Route');
}

export async function resetPassword(req, res){
    res.json('resetPassword Route');
}