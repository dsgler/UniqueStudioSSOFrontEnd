<template>
  <router-view v-slot="{ Component, route }">
    <div class="p-5 h-full max-h-full relative max-[400px]:pl-[10px] pr-[10px]">
      <keep-alive exclude="detail">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </div>
  </router-view>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
