import mongoose, {Document, model, Schema} from "mongoose";

import { EOnboardingPhase, IOnboardingPhase, STATUS } from "../common/constant";
import { MODEL_NAME } from "./manifest";
export const UserSchema = new Schema<IUser>({
        status: {type: String,required: true,enum: Object.values(STATUS), default:STATUS.ACTIVE},
        supabase_id:{type: String,required: true},
        aud:{type: String,required: true},
        role:{type: String,required: true},
        email: {type: String,required: true,unique: true,lowercase: true},
        email_confirmed_at:{type: String},
        phone: {type: String},
        last_sign_in_at: {type: String},
        app_metadata:{
            provider: {type: String,required: true},
            providers:{type: [String],required: true},
        },
        user_metadata:{
            email: {type: String,required: true},
            first_name: {type: String},
            last_name: {type: String},
            phone_number:{type: String},
            phone_verified:{type: Boolean,default: false},
            sub:{type: String,required: true},
            email_verified:{type: Boolean,default: false}
        },
        identities:{type: [Object],required: true},
        // is_anonymous:{type: Boolean,default: false},
        supabase_created_at:{type: String},
        supabase_updated_at:{type: String},
        // is_onboarded:{type: Boolean,default: false},
        // onboarding_phase:{type: String, enum:[ 'PHONE_VERIFICATION' , 'EMAIL_VERIFICATION' , 'SCREEN_LOCK' , 'BVN' , 'COMPLETED'],default: 'EMAIL_VERIFICATION'},
        // is_account_healthy:{type: Boolean,default: false},
        referral_code: {type: String},
        onboarding_phase: {type: String,default: EOnboardingPhase.FULLNAME},
        onboarding:{
          fullname: {type: String},
          dob:{
            dob:{type: String},
            astral_sign: {type: String}
          },
          gender:{type: String},
          looking_for: {type: String},
          bio:{type: String},
          interests:{type:[String]},
          height:{
            value:{type: Number},
            metric: {type: String},
          },
          education: {
            school:{type: String},
            cert:{type: String}
          },
          language:{
            primary:{type: String},
            values:{type: [String]}
          },
          religion:{type: String},
          family_plan:{type: String},
          lifestyle: {
            pets: {type: String},
            drinking:{type: String},
            smoking: {type: String},
            workout: {type: String}
          },
          going_out:{
            find_me: {type: String},
            like_to: {type: String},
            tend_to: {type: String}
          },
          weekends:{
            weekends_for: {type: String},
            saturday_nights_for: {type: String},
            sunday_for: {type: String}
          },
          m_phone: {
            type_who:{type: String},
            prefer_receiving: {type: String},
            phone_is_always_on: {type: String}
          }

        }
    },
    {
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
        timestamps: {createdAt: "created_at", updatedAt: "updated_at"},
    })



export interface IUser extends Document {
    status?: string,
    supabase_id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone?: string;
    referral_code: string;
    last_sign_in_at: string;
    app_metadata:{
        provider: string;
        providers:string[];
    };
    user_metadata:{
        email: string;
        email_verified: boolean;
        first_name: string;
        last_name: string;
        phone_number: string;
        phone_verified: boolean;
        sub: string;
    };
  identities:IIdentities[];
  supabase_created_at?: string;
  supabase_updated_at?: string;
  created_at?: string;
  updated_at?: string;
  profile_pics: mongoose.Types.ObjectId;
  onboarding: IOnboarding;
  onboarding_phase?: IOnboardingPhase;

}

interface IOnboarding{
  fullname?: string;
  dob:{
    dob?: string;
    astral_sign?: string;
  }
  gender?: string;
  looking_for?: string;
  bio?: string;
  interests?: string[];
  height: {
    value?: number;
    metric?: string;
  },
  education: {
    school?: string;
    cert?: string;
  },
  language:{
    primary?: string;
    values?: string[];
  },
  religion?: string;
  family_plan?: string; // want to have a child or not
  lifestyle: {
    pets?: string; // select a pet animal
    drinking?: string; // you drink or not
    smoking?: string; // how often do you smoke
    workout?: string; // how often do you workout
  },
  going_out:{
    find_me?: string; // you can find me...e.g socializing
    like_to?: string; // i like to dress down
    tend_to?: string; // i tend to arrive fashionably late
  },
  weekends:{
    weekends_for?: string; // my weekends are for socializing
    saturday_nights_for?: string;
    sunday_for?: string;
  },
  m_phone: {
    type_who?: string;
    prefer_receiving?: string;
    phone_is_always_on?: string;
  }

}


interface IIdentities{
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: any;
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email?: string;
}
interface IBvn{
    status: string;
    bvn_reference: string;
    bvn_flutterwave_id: number;
    firstname: string;
    lastname: string;
    bvn: string;
    nin: string;
}
// interface IWallet{

// }

// VoucherSchema.plugin(timeZone, { paths: ['created_at', 'updated_at'] });

export default model<IUser>(MODEL_NAME.USER, UserSchema);
