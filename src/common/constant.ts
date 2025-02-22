export const STATUS = {
  ACTIVE: "active",
  INACTIVE:"inactive",
  SUSPENDED:"suspended",
  BANNED:"banned",
  DELETED:"deleted",
  ARCHIVED:"archived",
  SETTLED:"settled",
  COMPLETED:"completed",
  PENDING:"pending"
};
export type IOnboardingPhase = 'FULLNAME' | 'DOB' | 'GENDER' | 'LOOKING_FOR' | 'WHERE_DO_YOU_LIVE' | 'BIO' | 'INTEREST' | 'HEIGHT' | 'EDUCATION' | 'LANGUAGE' | 'RELIGION' | 'FAMILY_PLAN' | 'LIFESTYLE' | 'GOING_OUT' | 'WEEKENDS' | 'PHONE' | 'MEDIA' | 'LOCATION';

export enum EOnboardingPhase {
  FULLNAME = "FULLNAME",
  DOB = "DOB",
  GENDER = "GENDER",
  LOOKING_FOR = "LOOKING_FOR",
  BIO = "BIO",
  WHERE_DO_YOU_LIVE="WHERE_DO_YOU_LIVE",
  INTEREST = "INTEREST",
  HEIGHT = "HEIGHT",
  EDUCATION = "EDUCATION",
  LANGUAGE = "LANGUAGE",
  RELIGION = "RELIGION",
  FAMILY_PLAN = "FAMILY_PLAN",
  LIFESTYLE = "LIFESTYLE",
  GOING_OUT = "GOING_OUT",
  WEEKENDS = "WEEKENDS",
  PHONE = "PHONE",
  MEDIA = 'MEDIA',
  LOCATION = 'LOCATION'
};


export enum METHOD {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  DELETE = "delete",
}


// keys
export const JWT = 'JWT__';
export const SUPABASE_ID = "SUPABASE_ID__";
export const USER = 'USER__'
