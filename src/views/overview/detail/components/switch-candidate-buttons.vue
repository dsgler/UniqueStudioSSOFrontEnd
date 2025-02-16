<template>
  <div class="mr-2 flex gap-2">
    <!-- 新增切换选手buttons，只在 candidate-info-card 下显示 -->
    <a-button
      v-if="showSwitchButtons"
      type="secondary"
      :size="buttonSize"
      class="max-sm:rounded-full rounded-none"
      :disabled="disablePrev"
      @click="switchPrev"
    >
      <icon-left />
    </a-button>
    <a-button
      v-if="showSwitchButtons"
      type="secondary"
      :size="buttonSize"
      class="max-sm:rounded-full rounded-none"
      :disabled="disableNext"
      @click="switchNext"
    >
      <icon-right />
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import useRecruitmentStore from '@/store/modules/recruitment';
import useWindowResize from '@/hooks/resize';
import { Step, recruitSteps, Group } from '@/constants/team';
import router from '@/router';

const props = defineProps({
  curStep: {
    type: Number,
    required: true,
  },
  currentGroup: {
    type: String as PropType<Group>,
    required: true,
  },
  aid: {
    type: String,
    required: true,
  },
});

const { widthType } = useWindowResize();
const buttonSize = computed(() =>
  widthType.value === 'sm' ? 'mini' : 'medium',
);

const recStore = useRecruitmentStore();

const StepsOrder = Object.values(Step).reduce(
  (res, x) => {
    res[x] = recruitSteps.findIndex(({ value }) => value.includes(x));
    return res;
  },
  {} as Record<Step, number>,
);

const filteredApps = computed(() => {
  if (props.curStep === 9) {
    return recStore.curApplications
      .filter(
        ({ group, abandoned, rejected }) =>
          group === props.currentGroup && (abandoned || rejected),
      )
      .sort((a, b) => StepsOrder[a.step] - StepsOrder[b.step]);
  }
  if (props.curStep === 10) {
    return recStore.curApplications
      .filter(({ group }) => group === props.currentGroup)
      .sort((a, b) => StepsOrder[a.step] - StepsOrder[b.step]);
  }
  return recStore.curApplications.filter(
    ({ step, group }) =>
      recruitSteps[props.curStep - 1].value.includes(step) &&
      group === props.currentGroup,
  );
});

const showSwitchButtons = computed(() => recStore.isBaseInfo);

const candidateDetails = computed(() => {
  const index = filteredApps.value.findIndex(({ uid }) => uid === props.aid);
  return {
    curIdx: index,
    prevAid: index > 0 ? filteredApps.value[index - 1].uid : '',
    nextAid:
      index >= 0 && index < filteredApps.value.length - 1
        ? filteredApps.value[index + 1].uid
        : '',
  };
});
const disablePrev = computed(() => candidateDetails.value.curIdx === 0);
const disableNext = computed(
  () => candidateDetails.value.curIdx === filteredApps.value.length - 1,
);

const switchPrev = () => {
  if (candidateDetails.value.curIdx > 0) {
    router.push(`${candidateDetails.value.prevAid}`);
  }
};

const switchNext = () => {
  if (candidateDetails.value.curIdx < filteredApps.value.length - 1) {
    router.push(`${candidateDetails.value.nextAid}`);
  }
};
</script>

<style scoped lang="less"></style>
