import { defineStore } from 'pinia'
import type { Component } from 'vue'

export const useModalStore = defineStore('modal', {
    state: () => ({
        isOpen: false,
        component: null as Component | null,
        props: {} as Record<string, any>
    }),
    actions: {
        open(component: Component, props: Record<string, any> = {}) {
            this.isOpen = true
            this.component = component
            this.props = props
        },
        close() {
            this.isOpen = false
            this.component = null
            this.props = {}
        }
    }
})
