module.exports = {
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
    pluginOptions: {
        svgSprite: {
            /*
             * The directory containing your SVG files.
             */
            dir: 'src/assets/svg',
            /*
             * The reqex that will be used for the Webpack rule.
             */
            test: /\.(svg)(\?.*)?$/,
            /*
             * @see https://github.com/kisenka/svg-sprite-loader#configuration
             */
            loaderOptions: {
                extract: false,
            },
            /*
             * @see https://github.com/kisenka/svg-sprite-loader#configuration
             */
            pluginOptions: {
                plainSprite: true
            }
        }
    },
    chainWebpack: config => {
        config.module
            .rule('svg-sprite')
            .use('svgo-loader')
            .loader('svgo-loader')
    }
};
