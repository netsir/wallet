const path = require('path')

/**
 * `electron-packager` options
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-packager.html
 */
module.exports = {
  // 架构
  arch: 'x64',
  // 使用 'electron/asar' 压缩应用
  asar: true,
  // 应用程序的目录
  dir: path.join(__dirname, '../'),
  // 设置 electron 程序的图标
  icon: path.join(__dirname, '../build/icons/icon'),
  // 忽略可能造成最后程序很大的文件
  ignore: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web))|\.gitkeep/,
  //  把构建结果存储到 `build`
  out: path.join(__dirname, '../build'),
  // 重写现有构建
  overwrite: true,
  // 指定平台的环境变量
  platform: process.env.BUILD_TARGET || 'all',
  // Copyright
  appCopyright:'Copyright (C) 2019 Nerthus',
  // 额外的资源
  extraResource: [
    path.join(__dirname, "../cnts/cnts"),
    // path.join(__dirname, "../cnts/cnts.exe"),
    path.join(
      __dirname,
      "../cnts/core." + process.env.TARGET_MODE + ".yaml")
  ]
}
