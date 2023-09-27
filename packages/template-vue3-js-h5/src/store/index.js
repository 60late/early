import { defineStore } from 'pinia'

export const store = defineStore({
	id: 'store',
	state: () => ({
		a: 0
	}),
	getters: {},
	actions: {
		updateValue(value) {
			this.a = value
		}
	}
})
