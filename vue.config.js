const path = require("path");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'html'];
function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    filenameHashing: false ,
    lintOnSave: false,
    runtimeCompiler: true,
    productionSourceMap: false,
    assetsDir: "static",
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: 80,
        https: false,
        //设置请求服务的代理
        proxy: {
            '/api': {
                target: "http://172.24.178.29:8080", //请求的实际接口
                secure: false, //如果是http接口，需要配置该参数
                ws: true, //访问网关，使用http的连接方式进行socket信息推送
                changeOrigin: true, //是否允许跨域
                pathRewrite: { //路径重写，
                    '^/api': ''//替换target中请求地址
                }
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
        // 配置全局样式变量
        const oneOfsMap = config.module.rule('scss').oneOfs.store;
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // 全局变量资源路径
                    resources: './src/assets/styles/global.scss'
                    // 全局变量路径数组 resources: ['.scss', '.scss']
                })
                .end()
        })
    },

    configureWebpack: config => {
        config.plugins.push(
            new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp(
                    '\\.(' +
                    productionGzipExtensions.join('|') +
                    ')$'
                ),
                threshold: 10240, // 只有大小大于该值的资源会被处理
                minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                deleteOriginalAssets: false, //删除源文件
            })
        )
    }









    /*
    chainWebpack: config => {
          config.set('externals', {
            vue: 'Vue',
            'element-ui':'ElementUI',
          })
          config.plugin('html')
          .tap(args => {
            args[0].cdn = cdn
            return args
          })
      }
    /*
    chainWebpack:config=>{
        //发布模式
        config.when(process.env.NODE_ENV === 'production',config=>{
            //entry找到默认的打包入口，调用clear则是删除默认的打包入口,add添加新的打包入口
            config.entry('app').clear().add('./src/main.js')

            //使用externals设置排除项
            config.set('externals',{
                vue:'Vue',
                axios:'axios',
                'element-ui':'ElementUI',
                nprogress:'NProgress',
            })
        })
        //开发模式
        config.when(process.env.NODE_ENV === 'development',config=>{
            config.entry('app').clear().add('./src/main.js')
        })
    }*/
}