import { StatusCodes } from "http-status-codes";
import { IUser, User } from '../models/User'
import { RequestHandler } from "express";
import * as yup from "yup";
import mongoose from 'mongoose';

const signUpValidation: yup.ObjectSchema<IUser> = yup.object().shape({
    username: yup.string().required().min(4).max(20),
    email: yup.string().email().required(),
    password: yup.string().required().min(6).max(20),
    birthDate: yup.date().required(),
    gender: yup.string().required(),
    genres: yup.array().of(yup.string().required()).required(),
    profilePicturePath: yup.string().notRequired(),
    biography: yup.string().notRequired(),
    favorites: yup.array().required().max(4),
});

const checkDuplicateEmail : RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email}).exec();
        if (user) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'e-mail already registered' });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
    }

    return next();
}

const checkDuplicateUsername : RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username}).exec();
        if (user) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'username already registered' });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
    }

    return next();
}

export const VerifySignUp = {
    signUpValidation,
    checkDuplicateEmail,
    checkDuplicateUsername,
}