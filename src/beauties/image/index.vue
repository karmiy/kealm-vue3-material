<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { UploadFile } from 'element-plus/lib/components/upload/src/upload.type';
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

interface UploadUserFile {
    url?: string;
}

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
    },
});
const emits = defineEmits(['update:modelValue']);

const onChange = (val?: string) => {
    emits('update:modelValue', val);
};

/* -------------------- BLOCK: 图片上传 -------------------- */
const fileList = ref<Array<UploadUserFile>>(props.modelValue ? [{ url: props.modelValue }] : []);
const handleChange = (file: UploadFile, list: UploadFile[]) => {
    fileList.value = list;

    // 删除
    if (!list.length) {
        onChange();
        return;
    }

    // 新增，需要上传完成才有效（非上传完成只是个本地 blob）
    const url = (list[0].response as { data: string })?.data;
    url && onChange(url);
};

/* -------------------- BLOCK: 预览弹框 -------------------- */
const dialogImageUrl = ref('');
const dialogVisible = ref(false);

const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!;
    dialogVisible.value = true;
};
</script>

<template>
    <config-item :class="beautyClassName('image')" v-bind="props">
        <el-upload
            :class="{
                'image-upload': true,
            }"
            :data="{ dir: 'img' }"
            :limit="1"
            action="/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleChange"
            :on-change="handleChange"
            :file-list="fileList"
        >
            <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
            <img style="width: 100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </config-item>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
