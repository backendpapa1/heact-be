import { z } from "zod";
import BaseControllerClass from "../../../base/BaseController";
import { USER } from "../../../../common/constant";
// COMMENT Endpoint to switch looking for?
const GetPotentialUsersSchema = z.object({
  astral_sign: z.string().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  looking_for: z.string().optional(), //COMMENT im thinking is should not be here
  interests: z.array(z.string()).optional(),
  height: z.object({
    minValue: z.number(),
    maxValue: z.number(),
    metric: z.enum(["cm", "m", "in", "ft", "mm", "dm", "yd"]),
  }).optional(),
  cert: z.string().optional(),
  language: z.string().optional(),
  religion: z.string().optional(),
  family_plan: z.string().optional(),
  lifestyle: z.object({
    pets: z.string(),
    drinking: z.string(),
    smoking: z.string(),
    workout: z.string()
  }).optional(),
  going_out: z.object({
    find_me: z.string(),
    like_to: z.string(),
    tend_to: z.string(),
  }).optional(),
  weekends:z.object({
    weekends_for: z.string(),
    saturday_nights_for: z.string(),
    sunday_for: z.string(),
  }).optional(),
  m_phone: z.object({
    type_who: z.string(),
    prefer_receiving: z.string(),
    phone_is_always_on: z.string(),
  }).optional(),
  page: z.number().default(1),
  limit:z.number().default(20)
})

type GetPotentialUsersSchema = z.infer<typeof GetPotentialUsersSchema>;
//COMMENT add the looking for by default to the payload.. always selected

class GetPotentialUsers extends BaseControllerClass{
  constructor(){
    super();
  }

  protected initRoutes(): void {

  }
  protected initServices(): void {

  }
  protected initMiddleware(): void {

  }
  protected execute(): void {
    this.router.post('/', async (req, res) => {
      try {
        await GetPotentialUsersSchema.parseAsync(req.body);
        const user = res.locals[USER];
        const { astral_sign,country,looking_for,interests,height,gender,cert,language,religion,family_plan,lifestyle,going_out,weekends,m_phone,page,limit}: GetPotentialUsersSchema = req.body;
        const filters: any = {};

        if (gender) filters["onboarding.gender"] = gender;
        if (looking_for) filters["onboarding.looking_for"] = looking_for;
        if (religion) filters["onboarding.religion"] = religion;
        if (astral_sign) filters['onboarding.dob.astral_sign'] = astral_sign;
        if (country) filters['onboarding.where_do_you_live.country'] = country;
        if (interests) {
          const interestArray = Array.isArray(interests) ? interests : [interests];
          filters["onboarding.interests"] = { $in: interestArray };
        }
        if ((height!== undefined) && (height?.minValue || height.maxValue)) {
          filters["onboarding.height.value"] = {};
          if (height.minValue) filters["onboarding.height.value"].$gte = height.minValue ;
          if (height.maxValue) filters["onboarding.height.value"].$lte = height.maxValue ;
        }
        if (cert) filters['onboarding.education.cert'] = cert;
        if (language) filters['onboarding.language.primary'] = cert;
        if (family_plan) filters['onboarding.family_plan'] = family_plan;
        if (lifestyle?.pets) filters['onboarding.lifestyle.pets'] = lifestyle.pets;
        if (lifestyle?.drinking) filters['onboarding.lifestyle.drinking'] = lifestyle.drinking;
        if (lifestyle?.smoking) filters['onboarding.lifestyle.smoking'] = lifestyle.smoking;
        if (lifestyle?.workout) filters['onboarding.lifestyle.workout'] = lifestyle.workout;
        if (going_out?.find_me) filters['onboarding.going_out.find_me'] = going_out.find_me;
        if (going_out?.like_to) filters['onboarding.going_out.like_to'] = going_out.like_to;
        if (going_out?.tend_to) filters['onboarding.going_out.tend_to'] = going_out.tend_to;
        if (weekends?.saturday_nights_for) filters['onboarding.weekends.saturday_nights_for'] = weekends?.saturday_nights_for;
        if (weekends?.sunday_for) filters['onboarding.weekends.sunday_for'] = weekends?.sunday_for;
        if (weekends?.weekends_for) filters['onboarding.weekends.weekends_for'] = weekends?.weekends_for;
        if (m_phone?.phone_is_always_on) filters['onboarding.m_phone.phone_is_always_on'] = m_phone.phone_is_always_on;
        if (m_phone?.type_who) filters['onboarding.m_phone.type_who'] = m_phone.type_who;
        if (m_phone?.prefer_receiving) filters['onboarding.m_phone.prefer_receiving'] = m_phone.prefer_receiving;

        const getUsers = await this.userService.paginate(filters, limit, page);

        return this.sendSuccessResponse(res, getUsers);
      }catch(e: any){
        return this.sendErrorResponse(res, e, this.errorResponseMessage.ACTION_ERROR('unable to fetch discovered users'), 400);
      }
    })
  }

}

export default new GetPotentialUsers().router;
