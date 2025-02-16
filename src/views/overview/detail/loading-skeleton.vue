<template>
  <a-skeleton :animation="true">
    <!-- 头部返回区域 -->
    <div class="mb-4">
      <a-skeleton-line :widths="['40px']" :rows="1" />
    </div>

    <!-- 用户信息区块 -->
    <div class="flex gap-4 mb-6">
      <!-- 头像区域 -->
      <a-skeleton-shape shape="circle" size="large" class="!w-20 !h-20" />

      <!-- 基本信息 -->
      <div class="flex-1">
        <a-skeleton-line
          :widths="['200px']"
          :rows="1"
          :line-height="28"
          class="mb-2"
        />
        <a-skeleton-line
          :widths="['160px', '180px']"
          :rows="2"
          :line-spacing="8"
        />
      </div>
    </div>

    <!-- 详细信息区块 -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- 左列 -->
      <div>
        <a-skeleton-line
          :widths="['80px', '100%', '100%', '100%']"
          :rows="4"
          :line-spacing="12"
        />
      </div>
      <!-- 右列 -->
      <div>
        <a-skeleton-line
          :widths="['80px', '60%', '80px', '70%']"
          :rows="4"
          :line-spacing="12"
        />
      </div>
    </div>

    <!-- 自我介绍 -->
    <div class="mb-6">
      <a-skeleton-line :widths="['80px']" :rows="1" class="mb-2" />
      <a-skeleton-line
        :widths="['100%', '100%', '80%']"
        :rows="3"
        :line-spacing="8"
      />
    </div>

    <!-- 当前阶段 -->
    <div class="mb-6">
      <a-skeleton-line :widths="['80px']" :rows="1" class="mb-2" />
      <a-skeleton-line :widths="['120px']" :rows="1" />
    </div>

    <!-- 评论区域 -->
    <div>
      <a-skeleton-line :widths="['80px']" :rows="1" class="mb-2" />
      <a-skeleton-shape class="!h-20 !w-full" />
    </div>
  </a-skeleton>
</template>

<style scoped>
/* 自定义形状尺寸 */
:deep(.arco-skeleton-shape) {
  border-radius: 4px;
}

:deep(.arco-skeleton-shape-circle) {
  border-radius: 50%;
}
</style>
