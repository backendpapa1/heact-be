import { USER } from "../../../../common/constant";
import InteractionService from "../../../../services/interaction-service";
import BaseControllerClass from "../../../base/BaseController";


class GetLikedOppositeUsers extends BaseControllerClass {
  private interactionService: InteractionService;
  constructor(){
    super();
    this.interactionService = new InteractionService();
  }

  protected initMiddleware(): void {

  }
  protected initRoutes(): void {

  }
  protected initServices(): void {

  }

  protected execute(): void {
    this.router.get('/', async(req,res) => {
      try{
        const {type }:any = req.query;
        const user = res.locals[USER];
        const getInteractions = await this.interactionService.find({
          toUser: user?._id,
          type: type
        })
        return this.sendSuccessResponse(res, getInteractions || []);
      }catch(e: any){
        return this.sendErrorResponse(res, e, this.errorResponseMessage.ACTION_ERROR(e?.message), 400)
      }
    })
  }

}

export default new GetLikedOppositeUsers().router;
