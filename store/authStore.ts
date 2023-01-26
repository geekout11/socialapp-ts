/* BASIC */
import axios from 'axios'

/* ZUSTAND */
import create from 'zustand'
import { persist } from 'zustand/middleware'


const authStore = (set: any) => ({
    userProfile: null,
    allUsers: [],

    addUser: (user: any) => set({ userProfile: user }),
    removeUser: () => set({ userProfile: null }),

    fetchAllUsers: async () => {
        const response = await axios.get('http://localhost:3000/api/users')

        set({allUsers: response.data})
    }
})

const useAuthStore: any = create(
    persist(authStore, {
        name: 'auth'
    })
)

export default useAuthStore;