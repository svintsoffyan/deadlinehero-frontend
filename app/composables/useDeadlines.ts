type Deadline = { title: string; description: string; date: string; createdAt: string }

const STORAGE_KEY = 'deadlines'

export function useDeadlines() {
    const deadlines = ref<Deadline[]>([])

    const load = () => {
        if (!import.meta.client) return
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            const arr: any[] = raw ? JSON.parse(raw) : []
            // Нормализуем старые записи без createdAt
            const nowISO = new Date().toISOString()
            deadlines.value = arr.map(d => ({
                title: d.title,
                description: d.description,
                date: d.date,
                createdAt: d.createdAt ?? nowISO
            }))
            // Сохраним обратно, чтобы больше не нормализовать
            localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines.value))
        } catch {
            deadlines.value = []
        }
    }

    const save = () => {
        if (!import.meta.client) return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines.value))
    }

    const add = (d: Deadline) => {
        deadlines.value.unshift(d)
        save()
    }

    const removeAt = (idx: number) => {
        deadlines.value.splice(idx, 1)
        save()
    }

    onMounted(load)

    return { deadlines, load, save, add, removeAt }
}
