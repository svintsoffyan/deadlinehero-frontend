<script setup lang="ts">
import { useDeadlines } from '~/composables/useDeadlines'

const emit = defineEmits<{ (e: 'close'): void }>()

const title = ref('')
const description = ref('')
const date = ref('')

const { add } = useDeadlines()

const canSubmit = computed(() => title.value.trim().length > 0 && !!date.value)

function submit() {
if (!canSubmit.value) return
add({
title: title.value.trim(),
description: description.value.trim(),
date: date.value,
createdAt: new Date().toISOString()
})
emit('close')
}
</script>

<template>
  <div class="create-deadline">
    <h2 class="create-deadline__title">Create New Deadline</h2>

    <div class="create-deadline__fields">
      <label>
        <span>Title</span>
        <input v-model="title" type="text" placeholder="Create The Future" />
      </label>

      <label>
        <span>Description</span>
        <input v-model="description" type="text" placeholder="It's not over until I win" />
      </label>

      <label>
        <span>Deadline</span>
        <input v-model="date" type="date" />
      </label>
    </div>

    <div class="create-deadline__actions">
      <button class="btn btn--secondary" @click="$emit('close')">Cancel</button>
      <button class="btn btn--primary" @click="submit">Create</button>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "./../assets/styles/_variables.sass" as *
@use "sass:color"

.create-deadline
  display: flex
  flex-direction: column
  gap: 20px
  color: $text-color

  &__title
    font-size: 22px
    font-weight: 600
    text-align: center
    margin-bottom: 4px

  &__fields
    display: flex
    flex-direction: column
    gap: 16px

    label
      display: flex
      flex-direction: column
      gap: 6px
      font-size: 14px

      span
        font-weight: 500

      input
        border: 1px solid $gray-border
        border-radius: 8px
        padding: 10px 12px
        font-size: 14px
        color: $text-color
        outline: none
        transition: border-color 0.15s, box-shadow 0.15s

        &::placeholder
          color: $placeholder

        &:focus
          border-color: $accent
          box-shadow: 0 0 0 2px $accent-ring

  &__actions
    display: flex
    justify-content: flex-end
    gap: 10px
    margin-top: 8px

.btn
  border: none
  border-radius: 8px
  font-weight: 500
  cursor: pointer
  padding: 10px 18px
  font-size: 14px
  transition: background 0.2s, transform 0.1s

  &:active
    transform: scale(0.98)

  &--primary
    background: $accent
    color: #fff

    &:hover
      background: $accent-hover

  &--secondary
    background: $secondary
    color: #374151

    &:hover
      background: $secondary-hover
</style>
