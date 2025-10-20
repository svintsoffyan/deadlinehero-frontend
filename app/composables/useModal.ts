import type { Component } from 'vue'
import { useModalStore } from '~/stores/modal'

export const useModal = () => {
    const modal = useModalStore()

    const openModal = (component: Component, props: Record<string, any> = {}) => modal.open(component, props)
    const closeModal = () => modal.close()

    return { openModal, closeModal, modal }
}
