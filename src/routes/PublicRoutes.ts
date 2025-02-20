import { Express, Router } from "express";
import signupController from "../controllers/public/authentication/signupController";
import loginController from "../controllers/public/authentication/loginController";
// import signon from "../controllers/public/authentication/signon";
// import getPlans from "../controllers/public/plan/get-plans";
const path = "/api/v1/public";

const app = Router();

app.get("/", (_: any, res: any) => {
  res.status(200).json("Docgist");
});
app.use(path + "/auth/signup", signupController);
app.use(path + "/auth/login", loginController);

// plan
// app.use(path + "/plan", getPlans); // n

export default app;
