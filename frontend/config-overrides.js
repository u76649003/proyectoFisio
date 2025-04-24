const webpack = require('webpack');
const { override, addWebpackPlugin, addWebpackAlias, addWebpackModuleRule } = require('customize-cra');
const path = require('path');

module.exports = override(
  // Añadir alias para módulos de Node.js
  addWebpackAlias({
    "zlib": require.resolve("browserify-zlib"),
    "path": require.resolve("path-browserify"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "assert": require.resolve("assert/"),
    "fs": require.resolve("browserify-fs"),
  }),
  
  // Deshabilitar módulos no necesarios
  addWebpackAlias({
    "crypto": false,
    "http": false,
    "https": false,
    "os": false,
    "url": false,
    "buffer": false,
  }),
  
  // Añadir plugins necesarios
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      process: require.resolve('process/browser.js'),
      Buffer: ['buffer', 'Buffer'],
    })
  ),
  
  // Configuración adicional para resolver problemas comunes
  (config) => {
    // Asegurarse de que la configuración de resoluciones exista
    if (!config.resolve) {
      config.resolve = {};
    }
    
    // Backward compatibility for older webpack versions
    if (!config.resolve.modules) {
      config.resolve.modules = ['node_modules'];
    }
    
    // Añadir extensiones para resolución de archivos
    if (!config.resolve.extensions) {
      config.resolve.extensions = ['.js', '.jsx', '.json'];
    } else {
      config.resolve.extensions = [...new Set([...config.resolve.extensions, '.js', '.jsx', '.json'])];
    }
    
    return config;
  }
); 