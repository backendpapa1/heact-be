import { z } from "zod";
import BaseControllerClass from "../../base/BaseController";

const LoginEmailSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }), 
    password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  });

  type LoginEmailSchema = z.infer<typeof LoginEmailSchema>;


class LoginController extends BaseControllerClass{
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
        // throw new Error("Method not implemented.");
        this.router.post('/', async (req,res) => {
            try{
                const parse = await LoginEmailSchema.parseAsync(req.body);
                const {email,password}:LoginEmailSchema = req.body;

                const {data,error} = await this.supabase.auth.signInWithPassword({
                    email,password
                })
                
                if(error) throw error;

                const getUser = await this.userService.findOne({
                    supabase_id: data?.user?.id
                })

                if(!getUser?._id) throw new Error('user not found... if you think this is wrong? try again in few mins.');

                return this.sendSuccessResponse(res,{
                    user: getUser,
                    token: data?.session?.access_token,
                    refresh_token: data?.session?.refresh_token,
                    provider_token: data?.session?.provider_token,
                    provider_refresh_token: data?.session?.provider_refresh_token,
                    token_type:data?.session?.token_type
                })

            }catch(e: any){
                return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
            }
        })
    }
    
}

export default new LoginController().router;