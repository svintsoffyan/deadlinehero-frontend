<template>
  <div class="main">
    <h1 class="main__title">Deadline Hero</h1>
    <p class="main__description">Stay on top of your important deadlines</p>
    <div class="main__buttons">
      <button class="buttons__button button__main" @click="open">Create New Deadline</button>
      <NuxtLink to="/my"><button class="buttons__button button__additional">View All Deadlines</button></NuxtLink>
    </div>
  </div>

</template>

<style scoped lang="sass">
@use './../assets/styles/_variables.sass' as *

.main
  margin: 0 auto
  width: 30%
  height: 20vh
  margin-top: 20%
  z-index: 1

  &__title
    text-align: center
    font-size: 48px
    color: $accent

  &__description
    margin-top: 16px
    font-size: 16px
    text-align: center
    margin-bottom: 32px

  .main__buttons
    margin-top: 5px

.buttons__button
  width: 55%
  margin: 0 auto
  display: block
  padding: 10px 0
  margin-top: 20px
  border-radius: 8px
  font-size: 16px
  border: 1px solid $gray-border
  transition: 0.3s

.button__main
  background: $accent
  color: $secondary

  &:hover
    background: $accent-hover

.button__additional
  background: $secondary
  color: $accent

  &:hover
    background: $secondary-hover

.blackout_filter
  display: block
  width: 100vw
  height: 100vh
  position: absolute
  top: 0
  left: 0
  z-index: 2
  background: black
  opacity: 0
</style>

<script setup lang="ts">
import { useModal } from '~/composables/useModal'
import CreateTaskModal from '~/components/CreateDeadlineModal.vue'

const { openModal } = useModal()

onMounted(() => {
  if (localStorage.getItem('deadlines') === null) {
    localStorage.setItem('deadlines', JSON.stringify([]))
  }
})

const open = () => openModal(CreateTaskModal, { projectId: 123 })
</script>