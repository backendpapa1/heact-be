import multer,{Field,} from "multer";
import BaseControllerClass from "../../../base/BaseController";
import { MinioS3 } from "../../../../utils/MinioService";
import { USER } from "../../../../common/constant";
import { IUser } from "../../../../models/user";
import MediaService from "../../../../services/media-service";


interface IMulter {
    fieldname: string;
    originalname: string;
    encoding: any;
    mimetype: string;
    size: any;
    destination: any;
    filename: string;
    path: any;
    buffer: Buffer;
}

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});



class MediaController extends BaseControllerClass{

    private minioService: MinioS3;
    private mediaService: MediaService;
    constructor(){
        super();
        this.minioService = new MinioS3();
        this.mediaService = new MediaService();
    }
    protected initRoutes(): void {
        // throw new Error("Method not implemented.");
    }
    protected initServices(): void {
        // throw new Error("Method not implemented.");
    }
    protected initMiddleware(): void {
        // throw new Error("Metho÷d not implemented.");
    }
    protected execute(): void {
        // throw new Error("Method not implemented.");

        // upload media
        this.router.post('/', upload.single('media'), async (req,res) => {
            try{
                const user:IUser = res.locals[USER];
                const file: IMulter = req.file as IMulter;
                const {slot}: {slot: string;} = req.body;
                const slot_p = parseInt(slot);
                if(!file) throw new Error('no upload data found in payload');
                if(slot_p > 6) throw new Error('max photo limit exceeded');
                const getMediaSlot = await this.mediaService.findOne({slot:slot_p,user: user?.id});
                const fileNameSplit = file.originalname.split('.');
                const extension = fileNameSplit[fileNameSplit.length-1];
                const newfileName = file.originalname.split(' ').join('-');
                const min_name = `${user?.id}/${Date.now()}-${newfileName}`

                // console.log(file,'file')
                const uploadFile = await this.minioService.uploadFile(file?.buffer,min_name,file?.mimetype);
                console.log(uploadFile,'dd')
                // REFACTORING: Retrieve the previous data and delete from storage via redis. queue it up
                if(getMediaSlot?.id){
                    getMediaSlot.original_name = file?.originalname;
                    getMediaSlot.key = min_name;
                    getMediaSlot.mimetype = file?.mimetype;
                    getMediaSlot.etag = uploadFile?.data?.ETag;
                    getMediaSlot.size = file?.size;
                    getMediaSlot.bucket = process.env.BUCKET_NAME!

                    await getMediaSlot.save();
                    return this.sendSuccessResponse(res,{message:"media saved successfully"});
                }
                const saveMedia = await this.mediaService.save({
                    user: user?.id,
                    original_name: file?.originalname,
                    key: min_name,
                    mimetype: file?.mimetype,
                    etag: uploadFile?.data?.ETag,
                    size: file?.size,
                    bucket: process.env.BUCKET_NAME!,
                    slot: slot_p
                })
                if(!saveMedia?.id) throw new Error('unable to save new upload');
                return this.sendSuccessResponse(res,{message:"new media saved on a slot"});
            }catch(e: any){
                return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
            }
        })

        this.router.get('/key/', async(req,res) => {
            try{
                const {key} = req.query;
                if(!key) throw new Error('key not found');
                const getFile = await this.minioService.getFileUrl(key as string);
                return this.sendSuccessResponse(res,getFile);
            }catch(e: any){
                return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
            }
        })

        this.router.delete('/:id',async(req,res) => {
            try{
                const {id} = req.params;
                const getFileToBeDeleted = await this.mediaService.findById(id as string);
                if(!getFileToBeDeleted?.id) throw new Error('failed to get file');
                const deleteFile = await this.minioService.deleteFile(getFileToBeDeleted?.key);
                const deleteDBFile = await this.mediaService.DeleteOne({_id: id});
                if(!deleteDBFile?.id) throw Error('failed to delete from db');
                return this.sendSuccessResponse(res,{message:"file deleted"});
            }catch(e: any){
                return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
            }
        })

        this.router.get('/user/', async (req,res) => {
            try{
                const user: IUser = res.locals[USER];
                const getAllMedia = await this.mediaService.find({user: user?.id});
                return this.sendSuccessResponse(res,getAllMedia || []);
            }catch(e: any){
                return this.sendErrorResponse(res,e,this.errorResponseMessage.ACTION_ERROR(e?.message),400);
            }
        })
    }

}

export default new MediaController().router;
