<script setup lang="ts">
import { useDeadlines } from '~/composables/useDeadlines'
import { useModal } from '~/composables/useModal'
import CreateDeadlineModal from '~/components/CreateDeadlineModal.vue'

const { deadlines, load, removeAt } = useDeadlines()
const { openModal } = useModal()

function openCreate() {
  openModal(CreateDeadlineModal)
}

const fmt = (iso: string) => {
  if (!import.meta.client) return iso
  try {
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(iso))
  } catch { return iso }
}

function progressFor(d: { createdAt: string; date: string }) {
  const now = Date.now()
  const start = new Date(d.createdAt).getTime()
  const end = new Date(d.date).getTime()
  if (!isFinite(start) || !isFinite(end) || end <= start) return 100
  const p = ((now - start) / (end - start)) * 100
  return Math.max(0, Math.min(100, Math.round(p)))
}

function remainingLabel(d: { date: string }) {
  const end = new Date(d.date).getTime()
  const now = Date.now()
  const ms = end - now
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000))
  if (ms < 0) return `overdue by ${Math.abs(days)}d`
  if (days === 0) return 'due today'
  return `in ${days}d`
}

onMounted(load)
</script>

<template>
  <div class="my-page">
    <header class="my-page__header">
      <h1>My Deadlines</h1>
      <button class="btn btn--primary" @click="openCreate">+ Create Deadline</button>
    </header>

    <div v-if="deadlines.length" class="list">
      <article v-for="(d, i) in deadlines" :key="i" class="card">
        <div class="card__head">
          <h3 class="card__title">{{ d.title }}</h3>
          <time class="card__date">{{ fmt(d.date) }}</time>
        </div>

        <p class="card__desc" v-if="d.description">{{ d.description }}</p>

        <!-- Прогресс-бар -->
        <div class="progress">
          <div
              class="progress__bar"
              :style="{ width: progressFor(d) + '%' }"
              :data-overdue="new Date(d.date).getTime() < Date.now()"
          />
        </div>
        <div class="progress__meta">
          <span class="progress__label">{{ remainingLabel(d) }}</span>
          <span class="progress__value">{{ progressFor(d) }}%</span>
        </div>

        <div class="card__actions">
          <button class="btn btn--ghost" @click="removeAt(i)">Delete</button>
        </div>
      </article>
    </div>

    <div v-else class="empty">
      <p>No deadlines yet.</p>
      <button class="btn btn--primary" @click="openCreate">Create your first one</button>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "./../assets/styles/_variables.sass" as *
@use "sass:color"

.my-page
  display: grid
  gap: 20px
  padding: 20px

  &__header
    display: flex
    align-items: center
    justify-content: space-between
    gap: 12px

    h1
      margin: 0
      font-size: 24px
      font-weight: 700
      color: $text-color

.list
  display: grid
  gap: 12px

.card
  background: $bg
  border: 1px solid $gray-border
  border-radius: 12px
  padding: 14px 16px
  box-shadow: 0 2px 10px rgba(0,0,0,.04)

  &__head
    display: flex
    align-items: baseline
    justify-content: space-between
    gap: 12px

  &__title
    margin: 0
    font-weight: 600
    font-size: 16px
    color: $text-color
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    max-width: 70%

  &__date
    font-size: 13px
    color: $muted
    white-space: nowrap

  &__desc
    margin: 6px 0 0
    color: $text-color

  &__actions
    margin-top: 10px
    display: flex
    justify-content: flex-end

.progress
  position: relative
  height: 8px
  background: #f3f4f6
  border-radius: 999px
  overflow: hidden

  &__bar
    height: 100%
    width: 0%
    background: linear-gradient(90deg, color.adjust($accent, $lightness: 4%), $accent)
    border-radius: 999px
    transition: width .35s ease
    &[data-overdue="true"]
      background: linear-gradient(90deg, color.adjust($danger, $lightness: 4%), $danger)

.progress__meta
  margin-top: 6px
  display: flex
  align-items: center
  justify-content: space-between
  font-size: 12px
  color: $muted

.empty
  border: 1px dashed $gray-border
  background: $bg-soft
  border-radius: 12px
  padding: 32px
  text-align: center
  color: $muted
  display: grid
  gap: 12px

.btn
  border: none
  border-radius: 8px
  font-weight: 500
  cursor: pointer
  padding: 10px 16px
  font-size: 14px
  transition: background .2s, color .2s, opacity .2s, transform .1s

  &:active
    transform: scale(.98)

  &--primary
    background: $accent
    color: #fff
    &:hover
      background: $accent-hover

  &--ghost
    background: transparent
    color: $muted
    &:hover
      background: #f3f4f6
</style>
