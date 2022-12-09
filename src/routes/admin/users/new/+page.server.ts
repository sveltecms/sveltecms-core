import type { Actions } from './$types';
 
export const actions: Actions = {
    // New user
    default: async (event) => {
        // const jsonData = await event.request.json()
        const formData = await event.request.formData()
        console.log(formData)

    }
}