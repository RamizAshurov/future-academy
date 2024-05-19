import svgSprite from "gulp-svg-sprite"

const svgSprites = () => {
    return app.gulp.src(app.path.src.svgicons)
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../svg-icons.svg",
                    // Создавать страницу с примерами иконок
                    example: true
                }
            },
            shape: {
                transform: [
                    {
                        svgo: {
                            js2svg: { indent: 4, pretty: true },
                            plugins: [
                                {
                                    name: 'removeAttrs',
                                    params: {
                                        attrs: '(fill|stroke)',
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        }))
        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.plugins.browserSync.stream())
}

export { svgSprites } 

import svgmin from "gulp-svgmin"

const svg = () => {
    return app.gulp.src(app.path.src.svg)
        .pipe(svgmin({
            plugins: [
                "removeViewBox",
                "cleanupIDs",
                "removeXMLProcInst",
                "removeUselessStrokeAndFill",
                "removeComments",
                "removeEmptyContainers"
            ]
            // 
            // plugins: [
            //     {
            //          plugin name
            //          plugin params
            //     }
            // ]
        }))
}