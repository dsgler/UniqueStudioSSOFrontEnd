<template>
  <div class="flex h-min flex-row justify-center">
    <a-card
      class="w-full h-min"
      :class="{ 'bg-[rgb(var(--primary-1))]': checked }"
      size="small"
      hoverable
      :header-style="{ height: 'auto' }"
    >
      <template #title>
        <div class="flex w-full">
          <div
            style="scrollbar-width: none"
            class="flex justify-start gap-2 items-center overflow-y-auto grow overscroll-x-auto mr-[10px]"
          >
            <a-link
              class="shrink-0"
              @click="$router.push(`candidate-detail/${info.uid}`)"
            >
              <a-avatar class="bg-[rgb(var(--primary-6))] mr-2" :size="24">
                <img
                  v-if="info.user_detail?.avatar_url"
                  :src="info.user_detail.avatar_url"
                />
                <span v-else>{{ info.user_detail?.name ?? '' }}</span>
              </a-avatar>
              <a-typography-text class="sm:text-sm md:text-md lg:text-lg">
                {{ info.user_detail?.name || '' }}
              </a-typography-text>
            </a-link>
            <a-tag v-if="info.rejected" color="red" class="shrink-0">
              {{ $t('common.status.rejected') }}
            </a-tag>
            <a-tag v-if="info.abandoned" color="gray" class="shrink-0">
              {{ $t('common.status.abandoned') }}
            </a-tag>
            <a-tag
              v-if="
                curstep === 2 &&
                info.answer &&
                !info.abandoned &&
                !info.rejected
              "
              color="green"
              class="shrink-0"
            >
              {{ '笔试 ✅' }}
            </a-tag>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <a-tag v-if="info.is_quick" color="blue">
              {{ $t('common.user.Quick') }}
            </a-tag>
            <a-tag v-if="info.is_project_c" color="purple">
              {{ $t('common.user.ProjectC') }}
            </a-tag>
            <a-checkbox :value="info.uid"></a-checkbox>
          </div>
        </div>

        <div class="flex justify-between text-xs pt-3">
          <div>
            <span class="text-[--color-text-3] pr-1.5">
              {{ $t('common.user.gender') }}
            </span>
            <span>
              {{ $t(GenderMap[info.user_detail?.gender ?? 0]) }}
            </span>
          </div>
          <div>
            <span class="text-[--color-text-3] pr-1.5">
              {{ $t('common.user.grade') }}
            </span>
            <span>{{ info.grade }}</span>
          </div>
          <div>
            <span class="text-[--color-text-3] pr-1.5">
              {{ $t('common.user.institute') }}
            </span>
            <span>{{ info.institute }}</span>
          </div>
        </div>
      </template>
      <div class="flex justify-between">
        <div class="flex gap-2">
          <template v-for="[item, cnt, className] in EvaluationCnt" :key="item">
            <a-tag
              v-if="cnt"
              :class="className"
              class="text-xs rounded-full px-2.5"
            >
              <template #icon> {{ item }} </template>
              {{ cnt }}
            </a-tag>
          </template>
        </div>
        <a-link @click="$router.push(`candidate-detail/${info.uid}`)">
          <a-tag
            color="transparent"
            style="color: var(--color-text-3)"
            class="text-xs rounded px-1.5 py-1 bg-transparent"
          >
            <template #icon> <icon-message /> </template>
            {{ `${info.comments?.length ?? 0}条评论` }}
          </a-tag>
        </a-link>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { CandidateInfo } from '@/store/modules/recruitment/types';
import { EvaluationMap, GenderMap } from '@/constants/team';

const props = defineProps({
  info: {
    type: Object as PropType<CandidateInfo>,
    default: () => ({}),
  },
  checked: {
    type: Boolean,
    default: false,
  },
  curstep: {
    type: Number,
    default: 1,
  },
});

const EvaluationCnt = computed(() =>
  Object.entries(EvaluationMap)
    .filter(([key]) => Number(key) !== 0) // 过滤掉 Undefined 评价
    .map(([key, value]) => [
      value.emoji,
      props.info.comments?.filter(
        ({ evaluation }) => evaluation === Number(key),
      )?.length ?? 0,
      value.className,
    ]),
);
</script>

<style scoped lang="less"></style>
