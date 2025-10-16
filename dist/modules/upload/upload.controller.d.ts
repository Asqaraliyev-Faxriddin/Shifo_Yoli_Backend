export declare class UploadController {
    private readonly uploadDir;
    constructor();
    uploadFile(file: Express.Multer.File): Promise<{
        filename: string;
        url: string;
    }>;
    removeFile(filename: string): Promise<{
        message: string;
    }>;
}
