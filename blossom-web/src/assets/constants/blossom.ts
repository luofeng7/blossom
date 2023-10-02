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
    GONG_WANG_AN_BEI: "BLOSSOM-AB",
    // ICP 备案号
    ICP_BEI_AN_HAO: 'BLOSSOM-ICP',
    // 邮箱
    EMAIL: 'BLOSSOM-EMAIL'
  },
  /**
   * 填写服务器的地址
   */
  DOMAIN: {
    LOC: 'BLOSSOM-LOC',
    PRD: 'BLOSSOM-PRD',
    // 填写你开放为博客的用户ID
    USER_ID: 1
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
// }

export default blossom
