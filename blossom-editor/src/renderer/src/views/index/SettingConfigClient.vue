<template>
  <el-form :model="configEditorStyleForm" label-position="right" label-width="100px" style="width: 580px;">
    <bl-row just="center" class="config-module-titile">编辑器配置</bl-row>
    <el-form-item label="编辑器字体">
      <el-input v-model="configEditorStyleForm.fontFamily" size="default" @input="changeEditorStyle"></el-input>
      <div class="config-item-tip">
        会影响 Markdown 编辑器、预览、新窗口预览、编辑历史中的文章字体样式。中英文等宽字体在表格中会有更好的样式表现，如：<a href="https://github.com/be5invis/Sarasa-Gothic"
          target="_blank">更纱黑体(Sarasa Fixed CL)</a>。
      </div>
    </el-form-item>
    <el-form-item label="编辑器字体大小">
      <el-input v-model="configEditorStyleForm.fontSize" size="default" @input="changeEditorStyle"></el-input>
      <div class="config-item-tip">
        会影响 Markdown 编辑器、预览、新窗口预览、编辑历史中的文章字体大小。
      </div>
    </el-form-item>

  </el-form>

  <el-form :model="configViewStyleForm" label-position="right" label-width="100px" style="width: 580px;">
    <bl-row just="center" class="config-module-titile">页面样式</bl-row>
    <el-form-item label="文档菜单字体大小">
      <el-input v-model="configViewStyleForm.treeDocsFontSize" size="default" @input="changeViewStyle"></el-input>
      <div class="config-item-tip">
        会影响编辑器，照片墙中左侧树状菜单的字体大小。
      </div>
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConfigStore } from '@renderer/stores/config'
import type { EditorStyle, ViewStyle } from '@renderer/stores/config'

const configStore = useConfigStore()
const configEditorStyleForm = ref<EditorStyle>(configStore.editorStyle)
const configViewStyleForm = ref<ViewStyle>(configStore.viewStyle)

const changeEditorStyle = () => {
  configStore.setEditorStyle(configEditorStyleForm.value)
}

const changeViewStyle = () => {
  configStore.setViewStyle(configViewStyleForm.value)
}


</script>

<style scoped lang="scss">
.config-module-titile {
  padding-bottom: 10px;
  margin-bottom: 20px;
  color: var(--bl-text-color);
  border-bottom: 1px solid var(--el-border-color);
}

.config-item-tip {
  color: var(--bl-text-color-light);
}
</style>