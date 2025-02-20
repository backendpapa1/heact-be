import express, { Request, Response, NextFunction, Router } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserService from '../services/user-service';
import { retrieveSupabaseUser, retrieveToken, retrieveUser } from '../middleware/AuthorizationMiddleware';
import profileController from '../controllers/protected/user/profileController';
import onboardingController from '../controllers/protected/user/onboarding/onboardingController';
import mediaController from '../controllers/protected/user/media/mediaController';
const path = "/api/v1";







const app = Router();
// @ts-ignore
app.use(path + '/app', retrieveToken);
// @ts-ignore
app.use(path + '/app', retrieveSupabaseUser);
// @ts-ignore
app.use(path + '/app', retrieveUser);

app.use(path + "/app/user/profile", profileController);
app.use(path + "/app/user/onboarding", onboardingController);
app.use(path + "/app/user/media", mediaController);




// media level






export default app;



