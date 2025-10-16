export declare class UploadController {
    private readonly uploadDir;
    constructor();
    uploadFile(file: Express.Multer.File): Promise<{
        filename: any;
        url: any;
        display_url: any;
        delete_url: any;
    } | {
        filename: string;
        url: string;
        display_url?: undefined;
        delete_url?: undefined;
    }>;
    removeFile(filename: string): Promise<{
        message: string;
    }>;
}
