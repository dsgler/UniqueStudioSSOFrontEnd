<template>
  <div>
    <a-date-picker v-model="pickerValue" hide-trigger />
  </div>
  <div>
    <div class="text-[--color-text-1] text-xl font-bold mt-15 ml-5 pt-5">{{
      $t('common.applyInfo.recentSchedules')
    }}</div>
    <div class="">
      <a-empty
        :class="isEmpty ? 'block' : 'hidden'"
        class="mt-40 pb-40"
      ></a-empty>
      <li
        v-for="date in recents"
        :key="date.toDateString()"
        class="flex list-none ml-5 flex-col"
      >
        <div
          v-if="
            filteredSchedules.some(
              (schedule) => schedule.date.getTime() === date.getTime(),
            )
          "
          class="flex flex-col"
        >
          <div class="text-[--color-text-1] mt-5 ml-5 sm:text-lg">
            {{ date.getMonth() + 1 }}.{{ date.getDate() }}
          </div>
          <li
            v-for="schedule in filteredDateSchedules(date, true)"
            :key="schedule.name"
            class="flex list-none p-3 flex-wrap items-center"
          >
            <div class="flex justify-between items-center flex-row grow">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 mr-3 flex items-center justify-center"
                >
                  <icon-calendar class="sm:text-lg text-[--color-text-1]" />
                </div>
                <span class="sm:text-lg mt-1 text-[--color-text-1]">{{
                  schedule.name
                }}</span>
              </div>
              <span class="text-blue-600">{{ schedule.time }}</span>
            </div>
          </li>
        </div>
      </li>
      <a-button
        v-if="schedulesLength > 5"
        type="primary"
        class="w-4/5 sm:h-2.5vw ml-1/8 mt-4 sm:text-1vw"
        @click="openModel"
      >
        {{ $t('common.applyInfo.details') }}</a-button
      >
    </div>
  </div>
  <a-modal
    v-model:visible="visible"
    :closable="false"
    :hide-cancel="true"
    :modal-style="{ maxHeight: 'min(700px,90vh)', overflowY: 'scroll' }"
  >
    <div class="text-[--color-text-1] text-xl font-bold ml-5">{{
      $t('common.applyInfo.recentSchedules')
    }}</div>
    <div>
      <li
        v-for="date in recents"
        :key="date.toDateString()"
        class="flex flex-col list-none ml-5 mb-6"
      >
        <div
          v-if="
            schedules.some(
              (schedule) => schedule.date.getTime() === date.getTime(),
            )
          "
          class="flex flex-col"
        >
          <div class="text-[--color-text-1] mt-5 ml-5 text-lg">
            {{ date.getMonth() + 1 }}.{{ date.getDate() }}
          </div>
          <li
            v-for="schedule in filteredDateSchedules(date, false)"
            :key="schedule.name"
            class="flex flex-row list-none p-3 justify-between flex-wrap"
          >
            <div class="flex flex-row grow items-center">
              <div class="w-10 h-10 rounded-full border-2 mr-3 p-2">
                <icon-calendar class="text-xl" />
              </div>
              <span class="text-lg mt-1 text-[--color-text-1]">{{
                schedule.name
              }}</span>
            </div>
            <span class="text-blue-600 mt-3 grow text-right">{{
              schedule.time
            }}</span>
          </li>
        </div>
      </li>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import useRecruitmentStore from '@/store/modules/recruitment';
import { getToday, transformedTime } from '@/utils';
import { Schedule } from '../type';

const visible = ref(false);

const openModel = () => {
  visible.value = true;
};

const pickerValue = ref(getToday());

const recStore = useRecruitmentStore();

const schedules = computed<Schedule[]>(() => {
  const schedule: Schedule[] = [];
  const validYear = 2000;
  recStore.curApplications.forEach((app) => {
    if (
      new Date(app.interview_allocations_group!.start).getFullYear() > validYear
    ) {
      const groupObj = {
        date: new Date(app.interview_allocations_group?.date as string),
        name: `${app.group}组面(${app.user_detail?.name})`,
        time: transformedTime(
          app.interview_allocations_group!.start,
          app.interview_allocations_group!.end,
        ),
      };
      schedule.push(groupObj);
    }

    if (
      new Date(app.interview_allocations_team!.start).getFullYear() > validYear
    ) {
      const teamObj = {
        date: new Date(app.interview_allocations_team?.date as string),
        name: `${app.group}群面(${app.user_detail?.name})`,
        time: transformedTime(
          app.interview_allocations_team!.start,
          app.interview_allocations_team!.end,
        ),
      };
      schedule.push(teamObj);
    }
  });
  schedule.sort((a, b) => {
    const d = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (d !== 0) {
      return d;
    }

    // 读取开始的小时和分钟
    const t = (s: Schedule) =>
      Number(s.time.substring(0, 2)) * 60 + Number(s.time.substring(3, 5));

    return t(a) - t(b);
  });

  return schedule;
});

const recents = computed<Date[]>(() => {
  const dateArray = [];
  for (let i = 0; i < 7; i += 1) {
    const today = new Date(pickerValue.value);
    today.setDate(today.getDate() + i);
    dateArray.push(today);
  }
  return dateArray;
});

const filteredSchedules = computed(() => {
  return schedules.value
    .filter((schedule) => {
      return recents.value.some(
        (date: Date) => schedule.date.getTime() === date.getTime(),
      );
    })
    .slice(0, 5);
});

const filteredDateSchedules = computed(() => {
  return (date: Date, filtered: boolean) => {
    return filtered
      ? filteredSchedules.value.filter((schedule) => {
          return schedule.date.getTime() === date.getTime();
        })
      : schedules.value.filter((schedule) => {
          return schedule.date.getTime() === date.getTime();
        });
  };
});

const schedulesLength = computed(() => {
  return schedules.value.filter((schedule) => {
    return recents.value.some(
      (date: Date) => schedule.date.getTime() === date.getTime(),
    );
  }).length;
});

const isEmpty = computed(() => {
  let empty = true;
  const scheduleTimes = schedules.value.map((schedule) =>
    schedule.date.getTime(),
  );
  recents.value.forEach((date) => {
    if (scheduleTimes.includes(date.getTime())) empty = false;
  });
  return empty;
});
</script>
