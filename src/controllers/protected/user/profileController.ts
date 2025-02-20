import { USER } from "../../../common/constant";
import BaseControllerClass from "../../base/BaseController";



class ProfileController extends BaseControllerClass{
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
        // throw new Error("Method not implemented.");
        this.router.get('/', async (req,res) => {
            try{
                const user = res.locals[USER];
                if(!user?.id) throw new Error('error fetching profile');
                return this.sendSuccessResponse(res,user);
            }catch(e: any){
                return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
            }
        })
    }
    
}

export default new ProfileController().router;