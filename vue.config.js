const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})


// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = JSON.stringify(true);
      return args;
    });
  }
};
// vue.config.js
module.exports = {
  publicPath: './', // Resimlerin doğru yoldan erişilmesi için
};



module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util/"),
        zlib: require.resolve("browserify-zlib"),
        url: require.resolve("url/"),
      }
    }
  }
});
const webpack = require('webpack'); 

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
    ]
  }
};
