import { Bind, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { url } from 'inspector';
import { diskStorage as multerDiskStorage } from 'multer';

@Controller()
export class UploadController {
    @Post('upload')
    @UseInterceptors(FileInterceptor('image', {
        storage: multerDiskStorage({
            destination: './uploads/',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                callback(null, `${uniqueSuffix}-${file.originalname}`);
            }
        })
    }))
    @Bind(UploadedFile())
    uploadFile(file) {

        return {
            url: `http://localhost:3001/api/${file.path}`
        }
    }

    @Get('uploads/:path')
    async getImage
    (
        @Param('path') path, 
        @Res() res: Response

    ){
        res.sendFile(path, {
            root: 'uploads'
        });
    }
}

