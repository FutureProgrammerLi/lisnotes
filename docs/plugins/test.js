import path from 'path';
import fs from 'fs';
// import imagemin from "imagemin";
// import imageminMozjpeg from "imagemin-mozjpeg";
// import imageminPngquant from "imagemin-pngquant";
// import { Plugin } from 'vite';

export default function CompressImgs() {
    return {
        name: 'CompressImgs',
        // apply: 'build' , // |'serve'
        async transform(src, id) {
            if (!/\.(jpe?g|png)$/i.test(id)) {
                return;
            }

            const outputPath = id.replace(/\.\w+$/, '.min.$&');
            const files = await imagemin.buffer(fs.readFileSync(id), {
                destination: path.dirname(outputPath),
                plugins: [
                    imageminMozjpeg({ quality: 75 }),
                    imageminPngquant({ quality: [0.6, 0.8] }),
                ],
            });
            fs.writeFileSync(outputPath, files[0].data);

            return {
                code: `export default import.meta.url;`,
                map: null,
                assets: [outputPath],
            }
        }
    }
}