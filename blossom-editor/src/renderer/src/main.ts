import '@renderer/assets/css/main.css' // html 全局样式
import '@renderer/assets/iconfont/blossom/iconfont.css'
import '@renderer/assets/iconfont/blossom/iconfont.js'
import '@renderer/assets/iconfont/tech/iconfont.js'
import '@renderer/assets/iconfont/weblogo/iconfont.js'
import '@renderer/assets/styles/index.scss'

import { createApp } from 'vue'
import App from './App.vue'

import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'

import pinia from '@renderer/stores/store-config'
import router from '@renderer/router/index'
import '@renderer/router/route-init'

// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@renderer/assets/css/theme.css' // 修改框架等的全局样式
import '@renderer/views/article/styles/bl-preview.css'

// BL Components
import BLTag from '@renderer/components/BLTag.vue'
import BLRow from '@renderer/components/BLRow.vue'
import BLCol from '@renderer/components/BLCol.vue'

const app = createApp(App)
app.use(pinia)
app.use(router)
app
  .component('bl-tag', BLTag)
  .component('bl-row', BLRow)
  .component('bl-col', BLCol)

app.mount('#app')
