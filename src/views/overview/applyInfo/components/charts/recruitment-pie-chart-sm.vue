<template>
  <div id="pie-chart1" ref="chartRef1" class="h-80"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import useRecruitmentStore from '@/store/modules/recruitment';
import { groupMapping } from '@/constants/team';
import { onMounted, ref, onUnmounted, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const recStore = useRecruitmentStore();

const chartRef1 = ref(null);
let myChart: echarts.ECharts | null = null;

const resizeChart = () => {
  myChart?.resize();
};

const recruitmentData = computed(() => recStore.currentRec);
const allApplicationCounts = computed(
  () => recruitmentData.value?.applications?.length,
);

const applicationCounts = computed(() => {
  return (targetGroup: string) => {
    return recruitmentData.value?.applications
      ? recruitmentData.value.applications.filter(({ group }) => {
          return group === targetGroup;
        }).length
      : 0;
  };
});

const createDataObject = (group: string, name: string) => {
  return {
    value: applicationCounts.value(group),
    name,
  };
};

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    title: {
      text: t('common.applyInfo.candidates'),
      left: 'center',
      top: 'center',
      textStyle: {
        color: '#a9aeb8',
      },
    },
    series: [
      {
        type: 'pie',
        data: Object.entries(groupMapping).map(([name, group]) =>
          createDataObject(group, name),
        ),
        label: {
          show: true,
          formatter(params: any) {
            return params.value === 0 ? '' : params.name;
          },
        },
        radius: ['90%', '70%'],
      },
    ],
  };
});

const initChart = () => {
  resizeChart();
  if (allApplicationCounts.value) myChart?.setOption(option.value);
};

onMounted(() => {
  myChart = echarts.init(chartRef1.value);
  initChart();
});

watch(
  () => option.value,
  () => initChart(),
  { deep: true },
);

window.addEventListener('resize', resizeChart);

onUnmounted(() => {
  myChart?.dispose();
  window.removeEventListener('resize', resizeChart);
});
</script>
