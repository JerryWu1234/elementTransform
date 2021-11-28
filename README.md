web-logger
=================
`web-logger` 整体采用插件化的方式, 支持按需加载,支持自定义插件. 内部采用fetch等原生方案保证埋点包整体大小.简化了加签验签方案、最大程度的减少初始化复杂度
------

-----
快速开始
-------
`web-logger` 开箱即用,并内置插件**fetchPlugin**, **detectRouter**,**detectDevice**,**detectionSignal**,**jsMobileBridge**,**getKey**,**vConsole**



- 通过npm方式安装

  ```bash
  # 需要安装最新的3.0的版本
  # 安装指定版本 
  # npm install web-logger@3.0.X
  npm install web-logger
  ```
- 代码中的运用
  
  ```ts
    import { detectDevice, detectRouter, fetchPlugin, WebLogger,detectionSignal, jsMobileBridge,getKey, vConsole} from 'web-logger'

    const weblogger = new WebLogger({
      // 具体字段意思可查询文档下面内容
      data: {
        // 车机端需要输入vin码
        // vin: '',
        // 用户类型
        user_type: '',
        user_id: '',
        open_id: '',
        p_name: '',
        p_package: '',
        p_id: '',
        // 当是webpc系统时需要传入'web',
        // device_type: '',
        // 当是webpc系统时需要传入'web',
        // form: ''
      },
      plugins: [
      // 路由监听包括初始化路由监听,事件的监听,此插件必须放在第一位
      detectRouter(),
      // 根据ip地质获取当前的一些网络信息和经纬度
      detectionSignal(),
      // 数据加密
      getKey(),
      // 数据上报
      fetchPlugin(),
      // 当前的设备的一些检测
      detectDevice(),
      
      // 可选择,当是app应用h5时需要增加这个插件
      jsMobileBridge(),

      vConsole({ maxLogNumber: 1000 })
      ]
    })

    //vue中
    Vue.prototype.$weblogger = weblogger

    weblogger.click({
      arg: {
      
      },
      ctrl_name: '',
      

    })

    weblogger.custom({
      event_name: ''
    })

  ```
----
插件介绍
----
- **fetchPlugin** 通过fetch方案上报大数据封装数据
  
- **detectRouter** 动态监测router跳转自动上报数据
  
- **detectionSignal** 可获取当前网络运营商、ip等信息

- **detectDevice** 根据navigation 监测当前设备、浏览器等相关信息
  
- **jsMobileBridge** 当是app应用h5时需要增加这个插件
  
- **getKey** 数据加密(必备)
  
- **vConsole** 内置移动端调试插件,自动检测环境

后续会增加更多的有意思好玩的插件

----
埋点文档
-----

此埋点后续专门服务于h5、小程序、webpc等相关技术,埋点相关字段可参照
https://beantechs.feishu.cn/sheets/shtcnnkybQ2e6JYNPDPz1GAniv0?sheet=2uXVpO&nd=3

---

QA常见问题
----

1. 问题: 安装web-logger过程中出现404
  
   答: 再根目录下创建一个 **.npmrc** 文件并填写内容 **registry = http://repo.btpoc.com/repository/npm-public/**

2. 问题：安装web-logger失败
   
   答: 尝试删除 **lock** 文件和 **node_modules** 文件,重新安装一遍依赖