import { z } from "zod";
import BaseControllerClass from "../../base/BaseController";
import {Request,Response,NextFunction} from 'express';
import { IUser } from "../../../models/user";
import mongoose from "mongoose";
// import { randomUUID } from 'crypto';

const SignupEmailSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }), 
    password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    referral: z.string().optional()
  });
  type SignupEmailSchema = z.infer<typeof SignupEmailSchema>;

class SignupController extends BaseControllerClass{

    constructor(){
        super();
    }
    protected initRoutes(): void {
        // throw new Error("Method not implemented.");
    }
    protected initServices(): void {
        // throw new Error("Method not implemented.");
    }
    protected initMiddleware(): void {
        // throw new Error("Method not implemented.");
    }
    protected execute(): void {
        this.router.post('/', async(req: Request,res: Response) => {
            const session = await mongoose.startSession();
            try{
                session.startTransaction();

                // const referralCode = randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase();
                const parse = await SignupEmailSchema.parseAsync(req.body);
                const {email,password,referral}: SignupEmailSchema = req.body;  

                // await this.transaction.begin();
                const {data:signUpData,error:signUpError} = await this.supabase.auth.signUp({
                    email,
                    password
                })
                if(signUpError) throw signUpError;
            
                const user = signUpData?.user;
                const userPayload: any = {
                    supabase_id: user?.id!,
                    role: user?.role!,
                    email: user?.email!,
                    email_confirmed_at: user?.email_confirmed_at!,
                    aud: user?.aud!,
                    phone: user?.phone!,
                    app_metadata:user?.app_metadata as any,
                    user_metadata:user?.user_metadata as any, 
                    identities: user?.identities as any[],
                    supabase_created_at: user?.created_at,
                    supabase_updated_at: user?.updated_at ,
                    last_sign_in_at: user?.last_sign_in_at!,
                    // referral_code: '',
                

                }
                res.locals.supabase_id = userPayload?.supabase_id;
                const createUser = await this.userService.save(userPayload,session);
               
                if(!createUser?.id) throw new Error('failed to create user'); 

                // send email welcome and verification
                const {data:loginData,error:loginError} = await this.supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if(loginError) throw loginError;

                await session.commitTransaction();

                return this.sendSuccessResponse(res,{
                    user: createUser,
                    token: loginData?.session?.access_token,
                    refresh_token: loginData?.session?.refresh_token,
                    provider_token: loginData?.session?.provider_token,
                    provider_refresh_token: loginData?.session?.provider_refresh_token,
                    token_type:loginData?.session?.token_type
                });

            }catch(e: any){
                await session.abortTransaction();
                if (res.locals.supabase_id) {
                    await this.supabase.auth.admin.deleteUser(res.locals.supabase_id!);
                  }
                return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
            }
        })
    }
   
}

export default new SignupController().router;