import { z } from "zod";
import BaseControllerClass from "../../../base/BaseController";
import { EOnboardingPhase, USER } from "../../../../common/constant";
import { IUser } from "../../../../models/user";

const FullnameSchema = z.object({
  fullname: z.string()
})

const dobSchema = z.object({
  dob: z.string(),
  astral_sign: z.string()
})

const genderSchema = z.object({
  gender: z.string()
})

const lookingForSchema = z.object({
  looking_for: z.string()
})

const bioSchema = z.object({
  bio: z.string()
})

const interestsSchema = z.object({
  interests: z.array(z.string())
})

const heightSchema = z.object({
  value: z.number(),
  metric: z.enum(["cm", "m", "in", "ft", "mm", "dm", "yd"])
})

const educationSchema = z.object({
  school: z.string(),
  cert: z.string()
})

const languageSchema = z.object({
  primary: z.string(),
  values: z.array(z.string())
})

const religionSchema = z.object({
  religion: z.string()
})

const familyPlanSchema = z.object({
  family_plan: z.string()
})

const lifestyleSchema = z.object({
  pets: z.string(),
  drinking: z.string(),
  smoking: z.string(),
  workout: z.string()
})

const goingOutSchema = z.object({
  find_me: z.string(),
  like_to: z.string(),
  tend_to: z.string()
})

const weekendsSchema = z.object({
  weekends_for: z.string(),
  saturday_nights_for: z.string(),
  sunday_for:z.string()
})

const phoneSchema = z.object({
  type_who: z.string(),
  prefer_receiving: z.string(),
  phone_is_always_on: z.string()
})

type phoneSchema = z.infer<typeof phoneSchema>;
type weekendsSchema = z.infer<typeof weekendsSchema>;
type goingOutSchema = z.infer<typeof goingOutSchema>;
type lifestyleSchema = z.infer<typeof lifestyleSchema>;
type familyPlanSchema = z.infer<typeof familyPlanSchema>;
type religionSchema = z.infer<typeof religionSchema>;
type languageSchema = z.infer<typeof languageSchema>;
type educationSchema = z.infer<typeof educationSchema>;
type heightSchema = z.infer<typeof heightSchema>;
type interestsSchema = z.infer<typeof interestsSchema>;
type bioSchema = z.infer<typeof bioSchema>;
type lookingForSchema = z.infer<typeof lookingForSchema>;
type genderSchema = z.infer<typeof genderSchema>;
type FullnameSchema = z.infer<typeof FullnameSchema>;
type dobSchema = z.infer<typeof dobSchema>;

class OnboardingController extends BaseControllerClass{
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
    // fullname
    this.router.post('/fullname', async (req,res) => {
      try{
        await FullnameSchema.parseAsync(req.body);
        const {fullname}:FullnameSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveFullnameToUser:any = await this.userService.updateOne(
          {_id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.DOB,
            onboarding:{
              fullname: fullname,
            }
          }
        );

        if(!saveFullnameToUser?.id) throw new Error('unable to save user fullname');
        return this.sendSuccessResponse(res,{message:"Fullname successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/dob', async (req,res) => {
      try{
        await dobSchema.parseAsync(req.body);
        const {astral_sign,dob}:dobSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveDOBToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.GENDER,
            onboarding:{
              dob:{
                dob:dob,
                astral_sign
              }
            }
          }
        );
        console.log(saveDOBToUser,'dd')
        if(!saveDOBToUser?.id) throw new Error('unable to save user dob');
        return this.sendSuccessResponse(res,{message:"dob successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/gender', async (req,res) => {
      try{
        await genderSchema.parseAsync(req.body);
        const {gender}:genderSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveGenderToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.LOOKING_FOR,
            onboarding:{
              gender
            }
          }
        );
        if(!saveGenderToUser?.id) throw new Error('unable to save user gender');
        return this.sendSuccessResponse(res,{message:"gender successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/looking-for', async (req,res) => {
      try{
        await lookingForSchema.parseAsync(req.body);
        const {looking_for}:lookingForSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveLookingForToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.BIO,
            onboarding:{
              looking_for
            }
          }
        );
        if(!saveLookingForToUser?.id) throw new Error('unable to save user looking for');
        return this.sendSuccessResponse(res,{message:"looking for successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/bio', async (req,res) => {
      try{
        await bioSchema.parseAsync(req.body);
        const {bio}:bioSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveBioToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.INTEREST,
            onboarding:{
              bio
            }
          }
        );
        if(!saveBioToUser?.id) throw new Error('unable to save user bio');
        return this.sendSuccessResponse(res,{message:"bio successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/interest', async (req,res) => {
      try{
        await interestsSchema.parseAsync(req.body);
        const {interests}:interestsSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveInterestsToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.HEIGHT,
            onboarding:{
              interests
            }
          }
        );
        if(!saveInterestsToUser?.id) throw new Error('unable to save user interests');
        return this.sendSuccessResponse(res,{message:"interests successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/height', async (req,res) => {
      try{
        await heightSchema.parseAsync(req.body);
        const {value,metric}:heightSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveHeightToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.EDUCATION,
            onboarding:{
              height:{
                value,
                metric
              }
            }
          }
        );
        if(!saveHeightToUser?.id) throw new Error('unable to save user height');
        return this.sendSuccessResponse(res,{message:"height successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/education', async (req,res) => {
      try{
        await educationSchema.parseAsync(req.body);
        const {cert,school}:educationSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveSchoolToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.LANGUAGE,
            onboarding:{
              education:{
                cert,
                school
              }
            }
          }
        );
        if(!saveSchoolToUser?.id) throw new Error('unable to save user education');
        return this.sendSuccessResponse(res,{message:"education successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/language', async (req,res) => {
      try{
        await languageSchema.parseAsync(req.body);
        const {primary,values}:languageSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveHeightToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.RELIGION,
            onboarding:{
              language:{
                values,
                primary
              }
            }
          }
        );
        if(!saveHeightToUser?.id) throw new Error('unable to save user language');
        return this.sendSuccessResponse(res,{message:"language successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/religion', async (req,res) => {
      try{
        await religionSchema.parseAsync(req.body);
        const {religion}:religionSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveReligionToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.FAMILY_PLAN,
            onboarding:{
              religion
            }
          }
        );
        if(!saveReligionToUser?.id) throw new Error('unable to save user religion');
        return this.sendSuccessResponse(res,{message:"religion successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/family-plan', async (req,res) => {
      try{
        await familyPlanSchema.parseAsync(req.body);
        const {family_plan}:familyPlanSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveFamilyPlanToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.LIFESTYLE,
            onboarding:{
              family_plan
            }
          }
        );
        if(!saveFamilyPlanToUser?.id) throw new Error('unable to save user family plan');
        return this.sendSuccessResponse(res,{message:"family plan successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/lifestyle', async (req,res) => {
      try{
        await lifestyleSchema.parseAsync(req.body);
        const {workout,drinking,pets,smoking}:lifestyleSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveLifestyleToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.GOING_OUT,
            onboarding:{
              lifestyle:{
                workout,
                drinking,
                pets,
                smoking
                }
            }
          }
        );
        if(!saveLifestyleToUser?.id) throw new Error('unable to save user lifestyle');
        return this.sendSuccessResponse(res,{message:"lifestyle successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/going-out', async (req,res) => {
      try{
        await goingOutSchema.parseAsync(req.body);
        const {find_me,like_to,tend_to}:goingOutSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveGoingOutToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.WEEKENDS,
            onboarding:{
              going_out: {
                find_me,
                like_to,
                tend_to
              }
            }
          }
        );
        if(!saveGoingOutToUser?.id) throw new Error('unable to save user going out');
        return this.sendSuccessResponse(res,{message:"going out successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/weekends', async (req,res) => {
      try{
        await weekendsSchema.parseAsync(req.body);
        const {weekends_for,saturday_nights_for,sunday_for}:weekendsSchema = req.body;
        const user: IUser = res.locals[USER];

        const saveWeekendsToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.PHONE,
            onboarding:{
              weekends:{
                weekends_for,
                saturday_nights_for,
                sunday_for
              }
            }
          }
        );
        if(!saveWeekendsToUser?.id) throw new Error('unable to save user weekends');
        return this.sendSuccessResponse(res,{message:"weekends successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

    this.router.post('/phone', async (req,res) => {
      try{
        await phoneSchema.parseAsync(req.body);
        const {type_who,prefer_receiving,phone_is_always_on}:phoneSchema = req.body;
        const user: IUser = res.locals[USER];

        const savePhoneToUser = await this.userService.updateOne(
          {id: user?.id},
          {
            onboarding_phase: EOnboardingPhase.MEDIA,
            onboarding:{
              m_phone:{
                type_who,
                prefer_receiving,
                phone_is_always_on
              }
            }
          }
        );
        if(!savePhoneToUser?.id) throw new Error('unable to save user phone');
        return this.sendSuccessResponse(res,{message:"phone successfully saved"})
      }catch(e: any){
        return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
      }
    })

  }
}


export default new OnboardingController().router;
