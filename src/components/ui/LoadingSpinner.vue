<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  text: '',
  centered: true,
})

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}
</script>

<template>
  <div :class="['flex items-center gap-3', centered ? 'justify-center' : '']">
    <font-awesome-icon icon="spinner" :class="['animate-spin text-blue-600', sizeClasses[size]]" />
    <span v-if="text" :class="['text-neutral-500 dark:text-neutral-400', textSizeClasses[size]]">
      {{ text }}
    </span>
  </div>
</template>
