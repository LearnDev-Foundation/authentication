import dotenv from 'dotenv';

dotenv.config();

export const mongodburi = process.env.MONGOURI;

export const jwtSecret = process.env.JWTSECRET;

export const emailAddress = process.env.EMAILADDRESS;

export const emailPassword = process.env.EMAILPASSWO;