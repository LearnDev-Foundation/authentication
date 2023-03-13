import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import { emailAddress, emailPassword } from '../config.js';

let nodeConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: emailAddress,
        pass: emailPassword
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: 'cerberus',
    textDirection: 'ltr',
    product: {
        name: "The LearnDev Team",
        link: "http://ldfhowto.vercel.app/",
        logo: "https://raw.githubusercontent.com/LearnDev-Foundation/.github/main/profile/images/Favicon.png"
    }
})

export const registerMail =  async (req, res) => {
    const { username, userEmail } = req.body;

    var email = {
        body: {
            name: username,
            intro: ["We are delighted to welcome you to LearnDev Foundation! We are thrilled to have you as a part of our community of learners who are passionate about honing their skills and growing their careers.", "Whether you are looking to enhance your technical skills, explore new technologies, or build a career in the tech industry, we have a range of courses and workshops that can help you get there.We believe that learning is a lifelong journey, and we are excited to support you in your pursuit of knowledge and growth.", "Thank you for choosing LearnDev Foundation as your learning partner."],
            outro: "Need help, or have questions? Reach out to us at learndevfoundation@gmail.com, we'd love to help."
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: `LearnDev Foundation <${emailAddress}>`,
        to: userEmail,
        subject : "Welcome to the LearnDev Family",
        html: emailBody
    }

    transporter.sendMail(message)
        .then(() => {
            res.status(200).json({ message: "An email has been sent to you" });
        })
        .catch(error => res.status(500).send({ error }));
}

export const resetPasswordMail = async (req, res) => {
    const { username, userEmail, text } = req.body;

    var email = {
        body: {
            name: username,
            intro: text,
            outro: "Need help, or have questions? Reach out to us at learndevfoundation@gmail.com, we'd love to help."
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: `LearnDev Foundation <${emailAddress}>`,
        to: userEmail,
        subject : "Reset Password OTP",
        html: emailBody
    }

    transporter.sendMail(message)
        .then(() => {
            res.status(200).json({ message: "An email has been sent to you" });
        })
        .catch(error => res.status(500).send({ error }));
}