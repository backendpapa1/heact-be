import { z } from "zod";
import InteractionService from "../../../../services/interaction-service";
import MatchService from "../../../../services/match-service";
import BaseControllerClass from "../../../base/BaseController";
import { USER } from "../../../../common/constant";
import mongoose from "mongoose";

const InteractWithUserSchema = z.object({
  toUser: z.string(),
  type: z.enum(['LIKE','DISLIKE','SUPER_LIKE','ROSES'])
})
type InteractWithUserSchema = z.infer<typeof InteractWithUserSchema>;


class InteractWithUser extends BaseControllerClass{
  private matchService: MatchService;
  private interactionService: InteractionService;
  constructor(){
    super();
    this.matchService = new MatchService();
    this.interactionService = new InteractionService();
  }
  protected initRoutes(): void {

  }
  protected initServices(): void {

  }
  protected initMiddleware(): void {

  }
  protected execute(): void {
    this.router.post('/', async (req,res) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try{
        await InteractWithUserSchema.parseAsync(req.body);
        const { toUser,type}: InteractWithUserSchema = req.body ;
        const user = res.locals[USER];
        const existingInteraction = await this.interactionService.findOne({ fromUser: user?.id, toUser });

        if (existingInteraction) throw new Error('already interacted with this user');

        const saveNewInteraction = await this.interactionService.save({
          toUser,
          fromUser: user?.id,
          type
        },session);
        let isMatch = false;
        // { $in: [InteractionType.LIKE, InteractionType.SUPER_LIKE] }
        if (!saveNewInteraction?.id) throw new Error('unable to confirm interaction');
        const positiveType = (type === 'LIKE') || (type === 'SUPER_LIKE') || (type === 'ROSES');
        if (positiveType) {
          const reciprocalLike = await this.interactionService.findOne({
            fromUser: toUser,
            toUser: user?.id,
            type: { $in: ['LIKE','SUPER_LIKE','ROSES']}
          });

          if (reciprocalLike) {
            const createMatch = await this.matchService.save({ user1: user?._id, user2: toUser },session);
            if (!createMatch?.id) throw new Error('unable to create a match');
            isMatch = true;
          }
        }
        await session.commitTransaction();
        return this.sendSuccessResponse(res, { message: "userInteracted", isMatch });
      }catch(e: any){
        await session.abortTransaction();
        return this.sendErrorResponse(res, e, this.errorResponseMessage.ACTION_ERROR(e?.message), 400);
      }
    })
  }
}

export default new InteractWithUser().router;
