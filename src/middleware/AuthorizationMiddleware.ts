import {Request,Response,NextFunction } from 'express';
import { z } from 'zod';
import { JWT, SUPABASE_ID, USER } from '../common/constant';
import { supabaseClient } from '../utils/Supabase';
import UserService from '../services/user-service';

const AuthToken = z.object({
    token: z.string().min(1, 'Authorization header is required')
    .refine((val) => val.startsWith('Bearer '), {
      message: 'Authorization must start with "Bearer "',
    }),
})

type AuthToken =  z.infer<typeof AuthToken>;

// retrive token
// get user information from supabase
// fetch the users information from our database and save to local.
export const retrieveToken = async (req: Request,res: Response,next: NextFunction) => {
    try{
        // retrieve 
        const {authorization} = req.headers;
        await AuthToken.parseAsync({token: authorization});

        const splitToken = authorization!.split(' ')[1];
        res.locals[JWT] = splitToken;
        next(); 

    }catch(e: any){
        return res.status(401).json({
            message: e?.message,
            success: false,
            error_code: 101
        })
    }
}

export const retrieveSupabaseUser = async (req: Request,res: Response,next: NextFunction) => {
    try{
        const jwt = res.locals[JWT];
        const {data,error} = await supabaseClient.auth.getUser(jwt);
        if(error) throw error;
        res.locals[SUPABASE_ID] = data?.user?.id; 
        next();
    }catch(e: any){
        return res.status(401).json({
            message: e?.message,
            success: false,
            error_code: 101
        })
    }
}


export const retrieveUser = async (req: Request,res: Response,next: NextFunction) => {
    try{
        const supabase_id = res.locals[SUPABASE_ID];
        const user = new UserService();
        const getUser = await user?.findOne({
            supabase_id: supabase_id
        })
        if(!getUser?._id) throw new Error('user not found.');
        res.locals[USER] = getUser;
        next();
    }catch(e: any){
        return res.status(401).json({
            message: e?.message,
            success: false,
            error_code: 101
        })
    }
}