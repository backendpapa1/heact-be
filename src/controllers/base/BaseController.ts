import { Router } from "express";
import AppError from "../../utils/AppError";
import BaseResponseHandler from "./BaseResponseHandler";
import UserService from "../../services/user-service";
import {SupabaseClient} from '@supabase/supabase-js'
import { supabaseClient } from "../../utils/Supabase";
import { TransactionManager } from "../../utils/TransactionManager";

abstract class BaseControllerClass extends BaseResponseHandler {
  protected userService: UserService;
  public router: Router;
  protected AppError;
  protected supabase: SupabaseClient;
  protected transaction:TransactionManager;
  constructor() {
    super();
    this.router = Router();
    this.AppError = AppError;
    this.userService = new UserService();
    this.supabase = supabaseClient;
    this.transaction = new TransactionManager(process.env.POSTGRES_URL!);

    this.initMiddleware();
    this.initRoutes();
    this.initServices();
    this.execute();
  }

  protected abstract initRoutes(): void;
  protected abstract initServices(): void;
  protected abstract initMiddleware(): void;
  protected abstract execute(): void;
}

export default BaseControllerClass;
