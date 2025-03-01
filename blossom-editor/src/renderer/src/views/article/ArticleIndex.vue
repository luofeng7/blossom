<template>
  <div class="index-article-root">

    <!-- folder menu -->
    <div class="doc-container" :style="{ width: docEditorStyle.docs }" v-show="docsExpand">

      <div class="doc-tree-menu-container" :style="tempTextareaStyle.docTree">
        <ArticleTreeDocs @click-doc="clickCurDoc" ref="ArticleTreeDocsRef"></ArticleTreeDocs>
      </div>

      <div class="doc-temp-textarea">
        <bl-row just="space-between" height="28px" class="doc-temp-textarea-workbench">
          <bl-row style="font-size: 10px;">
            <img src="@renderer/assets/imgs/note/cd.png" style="width: 15px;margin-right: 5px;">
            临时内容(可从便签快速设置)
          </bl-row>
          <div class="iconbl bl-subtract-line" @click="tempTextareaExpand = !tempTextareaExpand"></div>
        </bl-row>
        <bl-row class="doc-temp-textarea-input" :style="tempTextareaStyle.tempTextarea">
          <el-input v-model="tempTextarea" type="textarea" resize="none" @input="tempInput"></el-input>
        </bl-row>
      </div>
    </div>

    <!-- editor -->
    <div class="editor-container" :style="{ width: docEditorStyle.editor }" v-loading="editorLoading"
      element-loading-spinner="1" element-loading-text="正在读取文章内容...">
      <div class="editor-tools">
        <EditorTools @save="saveCurArticleContent()" @preview-full-screen="alt_3()" @editor-full-screen="alt_4()"
          @bold="cmw.commandBold()" @italic="cmw.commandItalic()" @strike="cmw.commandStrike()" @sub="cmw.commandSub()"
          @sup="cmw.commandSup()" @separator="cmw.commandSeparator()" @blockquote="cmw.commandQuote()"
          @blockquote-block="cmw.commandQuoteBlack()" @blockquote-green="cmw.commandQuoteGreen()"
          @blockquote-yellow="cmw.commandQuoteYellow()" @blockquote-red="cmw.commandQuoteRed()"
          @blockquote-blue="cmw.commandQuoteBlue()" @blockquote-purple="cmw.commandQuotePurple()"
          @code="cmw.commandCode()" @pre="cmw.commandPre()" @checkbox="cmw.commandCheckBox()"
          @unordered="cmw.commandUnordered()" @ordered="cmw.commandOrdered()" @table="cmw.commandTable()"
          @image="cmw.commandImg()" @link="cmw.commandLink()">
        </EditorTools>
      </div>

      <!-- 编辑器与预览 -->
      <div class="editor-preview" :style="editorStyle">
        <div class="gutter-holder" ref="GutterHolderRef"></div>
        <div class="editor-codemirror" ref="EditorRef" @click.right="handleEditorClickRight"></div>
        <div class="resize-divider" ref="ResizeDividerRef"></div>
        <div class="preview-marked bl-preview" ref="PreviewRef" v-html="articleHtml">
        </div>
        <el-backtop target=".editor-codemirror" :right="50" :bottom="50">
          <div class="iconbl bl-send-line backtop"></div>
        </el-backtop>
      </div>

      <!-- status -->
      <div class="editor-status">
        <EditorStatus :render-interval="renderInterval"></EditorStatus>
      </div>

      <!-- toc -->
      <div :class="['bl-preview-toc-absolute', (tocsExpand) ? 'is-expand-open' : 'is-expand-close']" ref="TocRef">
        <div class="toc-title" ref="TocTitleRef">目录 <span style="font-size: 10px;">(Alt+2 可隐藏)</span></div>
        <div class="toc-content" v-show="(tocsExpand)">
          <div v-for="toc in articleToc" :key="toc.index" :class="[toc.clazz]" @click="toScroll(toc.level, toc.content)">
            {{ toc.content }}
          </div>
        </div>
        <div class="img-title">引用图片</div>
        <div class="img-content">
          <div v-for="image in articleImg" :key="image.targetUrl">
            <el-image class="elimg" :src="image.targetUrl" fit="cover" :preview-src-list="[image.targetUrl]"
              :preview-teleported="true">
              <template #error>
                <div class="image-slot">
                  <el-icon :size="25">
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </div>

    </div>

    <Teleport to="body">
      <div v-show="editorRightMenu.show" class="editor-right-menu"
        :style="{ left: editorRightMenu.clientX + 'px', top: editorRightMenu.clientY + 'px' }">
        <div class="menu-content">
          <div class="menu-item" @click="rightMenuCopy">
            <span class="iconbl bl-copy-line"></span>复制
          </div>
          <div class="menu-item" @click="rightMenuPaste">
            <span class="iconbl bl-a-texteditorpastetext-line"></span>黏贴
          </div>
          <div class="menu-item">
            <el-upload :action="serverStore.serverUrl + uploadFileApiUrl" name="file" :data="{ pid: curArticle?.pid }"
              :headers="{ 'Authorization': 'Bearer ' + userStore.auth.token }" :show-file-list="false"
              :before-upload="beforeUpload" :on-success="onUploadSeccess" :on-error="onError">
              <span class="iconbl bl-image--line"></span>插入图片
            </el-upload>
          </div>
          <div class="menu-item" @click="formatTable">
            <span class="iconbl bl-transcript-line"></span>格式化选中表格
          </div>
          <div class="menu-item" @click="openExtenal('https://katex.org/#demo')">
            <span class="iconbl bl-a-texteditorsuperscript-line"></span>Katex 在线校验
          </div>
          <div class="menu-item" @click="openExtenal('https://mermaid.live/edit')">
            <span class="iconbl bl-a-statisticalviewpiechart3-line"></span>Mermaid 在线校验
          </div>
          <div class="menu-item" @click="openExtenal('https://www.emojiall.com/zh-hans')">
            <span style="margin-right: 4px;padding: 2px 0;">😉</span>Emoji网站
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// vue
import { ref, computed, provide, onMounted, onBeforeUnmount, onActivated, onDeactivated, defineAsyncComponent, watch } from "vue"
import { Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { storeToRefs } from "pinia"
import { useUserStore } from '@renderer/stores/user'
import { useServerStore } from '@renderer/stores/server'
import { useConfigStore } from '@renderer/stores/config'
import { articleInfoApi, articleUpdContentApi, uploadFileApi, uploadFileApiUrl } from '@renderer/api/blossom'
// utils
import { Local } from "@renderer/assets/utils/storage"
import { isBlank, isNull } from '@renderer/assets/utils/obj'
import { sleep } from '@renderer/assets/utils/util'
import { openExtenal, writeText, readText } from '@renderer/assets/utils/electron'
import { formartMarkdownTable } from '@renderer/assets/utils/format-table'
// component
import ArticleTreeDocs from './ArticleTreeDocs.vue'
// ts
import Notify from '@renderer/scripts/notify'
import { useDraggable } from '@renderer/scripts/draggable'
import type { shortcutFunc } from '@renderer/scripts/shortcut-register'
import ShortcutRegistrant from '@renderer/scripts/shortcut-register'
import { beforeUpload, onError } from '@renderer/views/picture/scripts/picture'
import { treeToInfo, provideKeyDocInfo, provideKeyCurArticleInfo } from '@renderer/views/doc/doc'
import { TempTextareaKey, ArticleReference, DocEditorStyle } from './scripts/article'
import { useResize } from "./scripts/editor-preview-resize"
// codemirror
import { CmWrapper } from './scripts/codemirror'
// marked
import marked, { renderBlockquote, renderCode, renderCodespan, renderHeading, renderImage, renderTable, tokenizerCodespan, renderLink } from './scripts/markedjs'
import { EPScroll } from './scripts/editor-preview-scroll'

const EditorTools = defineAsyncComponent(() => import('./EditorTools.vue'))
const EditorStatus = defineAsyncComponent(() => import('./EditorStatus.vue'))

onMounted(() => {
  initEditor()
  initScroll()
  addListenerScroll()
  initAutoSaveInterval()
})
onBeforeUnmount(() => {
  removeListenerShortcutMap()
  removeListenerEditorRightMenu()
  removeListenerScroll()
  distoryAutoSaveInterval()
})
onActivated(() => {
  enterView()
  addListererShortcutMap()
})
onDeactivated(() => {
  exitView()
  removeListenerShortcutMap()
})

//#region ----------------------------------------< panin store >--------------------------------------
const userStore = useUserStore()
const serverStore = useServerStore()
const configStore = useConfigStore()
const { editorStyle } = storeToRefs(configStore)

watch(() => userStore.userinfo.id, (_newId: number, _oldId: number) => {
  curDoc.value = undefined
  curActiveDoc.value = undefined
  curActiveDoc.value = undefined
  setDoc('')
})
//#endregion

//#region ----------------------------------------< 公共参数和页面动态样式 >--------------------------------------
const GutterHolderRef = ref()   // editor gutter holder
const EditorRef = ref()         // editor
const ResizeDividerRef = ref()  // editor&preview resize dom
const PreviewRef = ref()        // html 预览

/**
 * 文档列表的展开和收起
 */
const docsExpand = ref<boolean>(true)
const tocsExpand = ref<boolean>(true)
const docEditorStyle = computed<DocEditorStyle>(() => {
  if (!docsExpand.value) {
    return { docs: '0px', editor: '100%' }
  }
  return { docs: '250px', editor: 'calc(100% - 250px)' }
})

/**
 * 编辑器和预览的展开收起
 */
let previewFullScreen = false // 是否全屏展开预览
let editorFullScreen = false  // 是否全屏展开编辑
const changeEditorPreviewStyle = () => {
  if (previewFullScreen) {
    GutterHolderRef.value.style.width = '0px'
    EditorRef.value.style.width = '0px'
    PreviewRef.value.style.width = '100%'
    PreviewRef.value.style.padding = '10px 20px 0 20px'
    return
  }
  if (editorFullScreen) {
    GutterHolderRef.value.style.width = '50px'
    EditorRef.value.style.width = 'calc(100% - 6px)'
    PreviewRef.value.style.width = '0'
    PreviewRef.value.style.padding = '0'
    return
  }
  GutterHolderRef.value.style.width = '50px'
  EditorRef.value.style.width = '50%'
  PreviewRef.value.style.width = '50%'
  PreviewRef.value.style.padding = '10px 20px 0 20px'
}
/**
 * 临时文本框
 */
const tempTextarea = ref('')
const tempTextareaExpand = ref(true)
const tempTextareaStyle = computed<any>(() => {
  if (tempTextareaExpand.value) {
    return {
      docTree: { height: 'calc(100% - 178px)' },
      tempTextarea: { height: '150px', padding: '10px' }
    }
  }
  return {
    docTree: { height: 'calc(100% - 28px)' },
    tempTextarea: { height: '0', padding: '' }
  }
})
const initTempTextarea = () => {
  tempTextarea.value = Local.get('editor_temp_textarea_value')
}
const tempInput = (value: string) => {
  Local.set(TempTextareaKey, value)
}


/**
 * 进入页面时, 保存文章
 */
const enterView = () => {
  autoSave()
  initTempTextarea()
}
/**
 * 退出页面时, 保存文章
 */
const exitView = () => {
  autoSave()
}
//#endregion

//#region ----------------------------------------< 文档列表与当前文章 >----------------------------
const ArticleTreeDocsRef = ref()
const curDoc = ref<DocInfo>()           // 当前选中的文档, 包含文件夹和文章, 如果选中是文件夹, 则不会重置编辑器中的文章
const curArticle = ref<DocInfo>()       // 当前选中的文章, 用于在编辑器中展示
const curActiveDoc = ref<DocInfo>()     // 当前激活的文档的 index, 防止在刷新列表时重置选中, 导致需要再次从文档菜单中逐个点击
// 非绑定数据
// 文章是否在解析时, 为 true 则正在解析, 为 false 则解析完成
let articleParseing = false
// 编辑器内容是否有变更, 防止在没有变更时频繁保存导致请求接口和版本号的无意义变更, 如果为 true, 则文章允许保存, 为 false 时跳过保存
let articleChanged = false
// 上次保存时间
let lastSaveTime: number = new Date().getTime()
let autoSaveInterval: NodeJS.Timer
const authSaveMs = 5 * 60 * 1000

provide(provideKeyDocInfo, curDoc)
provide(provideKeyCurArticleInfo, curArticle)

/**
 * 点击 doc title 的回调, 用于选中某个文档
 * 选中分为两种
 * 1:选中的是文件夹
 * 2:选中的是文章, 则查询文章内容, 变
 * 
 * @param tree
 */
const clickCurDoc = async (tree: DocTree) => {
  let doc: DocInfo = treeToInfo(tree)
  curDoc.value = doc
  curActiveDoc.value = doc // 设置激活的菜单, 用于在刷新后仍然能选中当前的选项
  // 如果选中的是文章, 则查询文章详情, 用于在编辑器中显示以及注入
  if (doc.type == 3) {
    // 重复点击同一个, 不会多次查询
    if (curIsArticle() && curArticle.value!.id == doc.id) {
      return
    }
    editorLoading.value = true
    await saveCurArticleContent(true)
    clearTocAndImg()
    await articleInfoApi({ id: doc.id, showToc: false, showMarkdown: true, showHtml: false }).then(resp => {
      if (isNull(resp.data)) {
        return
      }
      curArticle.value = resp.data
      // 初次加载时立即渲染
      immediateParse = true
      if (isBlank(resp.data.markdown)) {
        setDoc('')
      } else {
        setDoc(resp.data.markdown)
      }
    }).finally(() => {
      editorLoading.value = false
      articleChanged = false
    })
  }
}
/**
 * 保存文章的正文, 并更新编辑器状态栏中的版本, 字数, 修改时间等信息.
 * 
 * @param auto 是否为自动保存, 如果是自动保存, 则不弹出保存成功的提示框, 避免在非用户主动操作下弹框
 */
const saveCurArticleContent = async (auto: boolean = false) => {
  if (!curIsArticle()) {
    return
  }
  const saveCallback = () => {
    if (!auto) {
      ElMessage.success({ message: '保存成功', duration: 1000, offset: 70, grouping: true })
    }
  }
  // 如果文档发生变动才保存
  if (!articleChanged) {
    console.info('%c文档内容无变化, 无需保存', 'background:#AD8CF2;padding: 3px 10px;color:#fff;border-radius:10px;')
    saveCallback()
    return
  }
  // 如果文档正在解析中, 则等待解析完成
  while (articleParseing) {
    await sleep(100);
  }
  articleChanged = false
  let data = {
    id: curArticle.value!.id,
    name: curArticle.value!.name,
    markdown: cmw.getDocString(),
    html: articleHtml.value,
    toc: JSON.stringify(articleToc.value),
    references: articleImg.value.concat(articleLink.value)
  }
  await articleUpdContentApi(data).then(resp => {
    lastSaveTime = new Date().getTime()
    curArticle.value!.words = resp.data.words as number
    curArticle.value!.updTime = resp.data.updTime as string
    if (curArticle.value!.version != undefined) {
      curArticle.value!.version = curArticle.value!.version + 1
    } else {
      curArticle.value!.version = 1
    }
    saveCallback()
  })
}
/**
 * 初始化自动保存定时器
 * 如果 authSaveMs 时间没有保存, 则自动保存.
 */
const initAutoSaveInterval = () => {
  autoSaveInterval = setInterval(() => {
    let current = new Date().getTime()
    if ((current - lastSaveTime) > authSaveMs) {
      autoSave()
    }
  }, 30 * 1000)
}
/**
 * 销毁自动保存定时器
 */
const distoryAutoSaveInterval = () => {
  clearInterval(autoSaveInterval)
}
/**
 * 自动保存, 该种方式不会有保存成功的提示
 */
const autoSave = () => {
  saveCurArticleContent(true)
}
/**
 * 判断当前选中的是否是文章
 */
const curIsArticle = (): boolean => {
  if (isNull(curArticle)) { return false }
  if (isNull(curArticle.value)) { return false }
  if (isNull(curArticle.value?.type) || curArticle.value?.type != 3) { return false }
  return true
}
/**
 * 文件上传成功
 * @param resp
 * @param file 
 */
const onUploadSeccess: UploadProps['onSuccess'] = (resp, file) => {
  if (resp.code === '20000') {
    cmw.insertBlockCommand(`\n![${file.name}](${resp.data})\n`)
  } else {
    Notify.error(resp.msg, '上传失败')
  }
}

//#endregion

//#region ----------------------------------------< codemirror/editor >----------------------------
const editorLoading = ref(false)  // eidtor loading
let cmw: CmWrapper                // codemirror editor wrapper

/**
 * 拖拽上传的回调
 * @param event 
 */
const uploadFileCallback = async (event: DragEvent) => {
  if (!curIsArticle()) {
    return
  }

  let data: DataTransfer | null = event.dataTransfer
  if (data && data.files.length && data.files.length > 0) {
    for (const file of data.files) {
      const form = new FormData()
      form.append('file', file)
      form.append('name', file.name)
      form.append('pid', curArticle.value!.pid.toString())
      uploadFileApi(form).then(resp => {
        cmw.insertBlockCommand(`\n![${file.name}](${resp.data})\n`)
      })
    }
  }
}

/** 
 * 初始化编辑器 
 */
const initEditor = (_doc?: string) => {
  cmw = new CmWrapper(CmWrapper.newEditor(
    // 创建 state
    CmWrapper.newState(
      () => {
        articleParseing = true
        debounce(parse, 300)
      },
      saveCurArticleContent,
      uploadFileCallback
    ),
    EditorRef.value)
  )
}
/**
 * 将 markdown 原文设置到编辑器中, 并且会重置编辑器状态
 * @param md markdown
 */
const setDoc = (md: string): void => {
  cmw.setState(
    CmWrapper.newState(
      () => {
        articleChanged = true
        articleParseing = true
        debounce(parse, 300)
      },
      saveCurArticleContent,
      uploadFileCallback, md
    )
  )
  parse()
}

//#endregion

//#region ----------------------------------------< marked/preview >-------------------------------
const renderInterval = ref(0) // 解析用时
const articleHtml = ref('')   // 解析后的 html 内容
let immediateParse = false    // 是否立即渲染, 文档初次加载时立即渲染, 内容变更时防抖渲染
/**
 * 自定义渲染
 */
const renderer = {
  table(header: string, body: string): string { return renderTable(header, body) },
  blockquote(quote: string): string { return renderBlockquote(quote) },
  codespan(src: string): string { return renderCodespan(src) },
  code(code: string, language: string | undefined, _isEscaped: boolean): string {
    return renderCode(code, language, _isEscaped, (eleid: string, svg: string) => {
      articleHtml.value = articleHtml.value.replaceAll(`>${eleid}<`, `>${svg}<`)
    })
  },
  heading(text: any, level: number): string {
    articleToc.value.push({ level: level, clazz: 'toc-' + level, index: articleToc.value.length, content: text })
    return renderHeading(text, level)
  },
  image(href: string | null, _title: string | null, text: string): string {
    articleImg.value.push({ targetId: 0, targetName: text, targetUrl: href as string, type: 10 })
    return renderImage(href, _title, text)
  },
  link(href: string | null, title: string | null, text: string): string {
    let { link, ref } = renderLink(href, title, text, ArticleTreeDocsRef.value.getDocTreeData())
    articleLink.value.push(ref)
    return link
  }
}

/**
 * 自定义解析
 */
const tokenizer = {
  codespan(src: string): any { return tokenizerCodespan(src) }
}

//@ts-ignore
marked.use({ tokenizer: tokenizer, renderer: renderer })

/**
 * 解析 markdown 为 html, 并将 html 赋值给 articleHtml
 */
const parse = () => {
  const begin = Date.now()
  immediateParse = false
  let mdContent = cmw.getDocString()
  clearTocAndImg()
  marked.parse(mdContent, { async: true }).then((content: string) => {
    articleHtml.value = content
    renderInterval.value = Date.now() - begin
    articleParseing = false
  })
}

/**
 * 防抖, 防止频繁渲染造成的卡顿
 */
let debounceTimeout: NodeJS.Timeout | undefined
function debounce(fn: () => void, time = 500) {
  if (debounceTimeout != undefined) {
    clearTimeout(debounceTimeout)
  }
  if (immediateParse) {
    fn()
  } else {
    debounceTimeout = setTimeout(fn, time)
  }
}

useResize(EditorRef, PreviewRef, ResizeDividerRef)
//#endregion

//#region ----------------------------------------< TOC >------------------------------------------
const articleToc = ref<any[]>([])
const articleImg = ref<ArticleReference[]>([])  // 文章对图片引用
const articleLink = ref<ArticleReference[]>([]) // 文章对链接的引用
const TocRef = ref()
const TocTitleRef = ref()
/**
 * 跳转至指定ID位置,ID为 标题级别-标题内容
 * @param level 标题级别
 * @param content 标题内容
 */
const toScroll = (level: number, content: string) => {
  let id = level + '-' + content
  let elm: HTMLElement = document.getElementById(id) as HTMLElement
  (elm.parentNode as Element).scrollTop = elm.offsetTop
}
// 清空当前目录内容
const clearTocAndImg = () => {
  articleToc.value = []
  articleImg.value = []
  articleLink.value = []
}

useDraggable(TocRef, TocTitleRef)

//#endregion

//#region ----------------------------------------< 双屏滚动  >----------------------------------------
let scrollWrapper: EPScroll
const initScroll = () => {
  scrollWrapper = new EPScroll(EditorRef.value, PreviewRef.value, cmw)
}

const scroll = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
  scrollWrapper.sycnScroll(event, source, lineno, colno, error)
}

const addListenerScroll = () => {
  EditorRef.value?.addEventListener('scroll', scroll)
}

const removeListenerScroll = () => {
  EditorRef.value?.removeEventListener('scroll', scroll)
}
//#endregion

//#region ----------------------------------------< 编辑器右键 >----------------------------------------
const editorRightMenu = ref<RightMenu>({ show: false, clientX: 0, clientY: 0 })
const rightMenuHeight = 215


const handleEditorClickRight = (event: MouseEvent) => {
  editorRightMenu.value = { show: false, clientX: 0, clientY: 0 }
  let y = event.clientY
  if (document.body.clientHeight - event.clientY < rightMenuHeight) {
    y = event.clientY - rightMenuHeight
  }
  editorRightMenu.value = { show: true, clientX: event.clientX, clientY: y }
  setTimeout(() => {
    document.body.addEventListener('click', closeEditorRightMenu)
  }, 100)
}

const closeEditorRightMenu = () => {
  removeListenerEditorRightMenu()
  editorRightMenu.value.show = false
}

const removeListenerEditorRightMenu = () => {
  document.body.removeEventListener('click', closeEditorRightMenu)
}


/** 复制当前选中内容 */
const rightMenuCopy = () => { writeText(cmw.getSelectionRangesText()) }
/** 右键黏贴功能 */
const rightMenuPaste = () => { cmw.insertBlockCommand(readText()) }

/**
 * 右键格式化表格功能
 */
const formatTable = () => {
  let ranges = cmw.getSlelctionRangesArr()
  if (ranges.length < 1) {
    Notify.error('未选中内容')
    return
  }
  if (ranges.length > 1) {
    Notify.error('选中内容过多')
    return
  }
  let text = cmw.sliceDoc(ranges[0].from, ranges[0].to)
  if (isBlank(text)) {
    return
  }
  cmw.insertBlockCommand(formartMarkdownTable(text))
}
//#endregion

//#region ----------------------------------------< 快捷键注册 >-------------------------------------
const shortcutRegistrant: ShortcutRegistrant = new ShortcutRegistrant().setDebug(false)
const alt_1: shortcutFunc = (): void => { docsExpand.value = !docsExpand.value }
const alt_2: shortcutFunc = (): void => { tocsExpand.value = !tocsExpand.value }
// 全屏预览
const alt_3: shortcutFunc = (): void => {
  previewFullScreen = !previewFullScreen
  if (previewFullScreen) {
    editorFullScreen = false
  }
  changeEditorPreviewStyle()
}
// 全屏编辑
const alt_4: shortcutFunc = (): void => {
  editorFullScreen = !editorFullScreen
  if (previewFullScreen) {
    previewFullScreen = false
  }
  changeEditorPreviewStyle()
}

const keydown = (evnet: KeyboardEvent) => { shortcutRegistrant.keydown(evnet) }
const keyup = (evnet: KeyboardEvent) => { shortcutRegistrant.keyup(evnet) }

/** 注册快捷键 */
const addListererShortcutMap = () => {
  // Alt + 1: 隐藏菜单
  // Alt + 2: 隐藏目录
  // Alt + 3: 隐藏编辑
  // Alt + 4: 隐藏预览
  let altAnd: Map<string, shortcutFunc> = new Map()
  altAnd.set("Digit1", alt_1)
  altAnd.set("Digit2", alt_2)
  altAnd.set("Digit3", alt_3)
  altAnd.set("Digit4", alt_4)
  shortcutRegistrant.register("AltLeft", altAnd)

  window.addEventListener("keydown", keydown)
  window.addEventListener("keyup", keyup)
  window.onblur = () => {
    shortcutRegistrant.clearDownCodes()
  }
}

/** 删除快捷键 */
const removeListenerShortcutMap = () => {
  window.removeEventListener('keydown', keydown)
  window.removeEventListener('keyup', keyup)
}

//#endregion

</script>

<style scoped lang="scss">
@import './styles/article-index.scss';
@import './styles/editor-right-menu.scss';
@import './styles/bl-preview-toc.scss';
@import './styles/article-backtop.scss';
@import '@renderer/assets/styles/bl-loading-spinner.scss';

.bl-preview {}

:deep(.el-loading-spinner) {
  @extend .bl-loading-spinner;
}
</style>