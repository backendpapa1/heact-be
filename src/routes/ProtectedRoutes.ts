import express, { Request, Response, NextFunction, Router } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserService from '../services/user-service';
import { retrieveSupabaseUser, retrieveToken, retrieveUser } from '../middleware/AuthorizationMiddleware';
import profileController from '../controllers/protected/user/profileController';
import onboardingController from '../controllers/protected/user/onboarding/onboardingController';
import mediaController from '../controllers/protected/user/media/mediaController';
import getPotentialUsers from '../controllers/protected/user/discover/getPotentialUsers';
import interactWithUser from '../controllers/protected/user/discover/interactWithUser';
import getLikedUsers from '../controllers/protected/user/match/getLikedUsers';
import getLikedOppositeUser from '../controllers/protected/user/match/getLikedOppositeUser';
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
app.use(path + "/app/user/discover", getPotentialUsers);
app.use(path + "/app/user/interaction", interactWithUser);
app.use(path + "/app/user/liked", getLikedUsers);
app.use(path + "/app/user/liked-opp", getLikedOppositeUser);




// media level






export default app;
