const blossom: any = {
  /**
   * 基础配置
   */
  SYS: {
    NAME: 'Blossom',
    SHORT_NAME: 'BLOSSOM-WEB',
    // 版本
    VERSION: 'v1.4.1',
    // 公网安备号
    GONG_WANG_AN_BEI: "X公网安备 XXXXXXXXXX号",
    // ICP 备案号
    ICP_BEI_AN_HAO: '京ICP备123123123号',
    // 邮箱
    EMAIL: '491548320@qq.com'
  },
  /**
   * 填写服务器的地址
   */
  DOMAIN: {
    LOC: 'http://127.0.0.1:9999/',
    PRD: 'https://www.wangyunf.com/bl/',
    // 填写你开放为博客的用户ID
    USER_ID: BLOSSOM-USER-ID
  },
  /**
   * 可以填写你自己的网站
   * NAME: 网站名称
   * URL: 网站地址
   * LOGO: 网站LOGO, 放在 src/assets/imgs/linklogo/ 路径下
   */
  LINKS: [
    {
      NAME: '我的个人主页',
      URL: 'https://www.wangyunf.com',
      LOGO: 'luban.png'
    },
    {
      NAME: 'Blossom 双链笔记软件',
      URL: 'https://www.wangyunf.com/blossom-doc/index',
      LOGO: 'blossom_logo.png'
    },
    {
      NAME: 'GuardCat 服务监控解决方案',
      URL: 'https://www.wangyunf.com/view/#/home',
      LOGO: 'guardcat_logo.jpg'
    }
  ]
}

export default blossom
