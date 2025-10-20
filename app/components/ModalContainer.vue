<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal" @after-leave="onAfterLeave">
        <div
            v-if="modal.isOpen"
            ref="overlayEl"
            class="modal-overlay"
            tabindex="-1"
            role="dialog"
            aria-modal="true"
        >
          <div class="modal-backdrop" @click="close" />
          <div class="modal-window" @click.stop>
            <component :is="modal.component" v-bind="modal.props" @close="close" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useModalStore } from '~/stores/modal'

const modal = useModalStore()
const overlayEl = ref<HTMLElement | null>(null)
const close = () => modal.close()

const lockScroll = () => { if (import.meta.client) document.documentElement.style.overflow = 'hidden' }
const unlockScroll = () => { if (import.meta.client) document.documentElement.style.overflow = '' }

let onKeydown: ((e: KeyboardEvent) => void) | null = null

onMounted(() => {
  // keydown только на клиенте
  onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal.isOpen) close()
  }
  window.addEventListener('keydown', onKeydown)

  // следим за открытием только на клиенте
  watch(() => modal.isOpen, async (isOpen) => {
    if (!import.meta.client) return
    if (isOpen) {
      lockScroll()
      await nextTick()
      overlayEl.value?.focus()
    } else {
      unlockScroll()
    }
  }, { immediate: true })
})

const onAfterLeave = () => unlockScroll()

onBeforeUnmount(() => {
  if (onKeydown) window.removeEventListener('keydown', onKeydown)
  unlockScroll()
})
</script>

<style scoped lang="sass">
@use "sass:color"

.modal-overlay
  position: fixed
  inset: 0
  z-index: 9999
  display: grid
  place-items: center
  outline: none

.modal-backdrop
  position: absolute
  inset: 0
  background: rgba(0, 0, 0, 0.4)

.modal-window
  position: relative
  z-index: 1
  background: #fff
  border-radius: 16px
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2)
  width: 100%
  max-width: 640px
  max-height: 90vh
  overflow: auto
  padding: 24px

/* анимации появления/исчезновения */
.modal-enter-active,
.modal-leave-active
  transition: opacity 0.18s ease

.modal-enter-from,
.modal-leave-to
  opacity: 0

.modal-enter-active .modal-window,
.modal-leave-active .modal-window
  transition: transform 0.2s ease, opacity 0.2s ease
  will-change: transform, opacity

.modal-enter-from .modal-window
  transform: translateY(20px) scale(0.98)
  opacity: 0

.modal-leave-to .modal-window
  transform: translateY(10px) scale(0.98)
  opacity: 0

.modal-enter-active .modal-backdrop,
.modal-leave-active .modal-backdrop
  transition: opacity 0.18s ease

.modal-enter-from .modal-backdrop,
.modal-leave-to .modal-backdrop
  opacity: 0
</style>
