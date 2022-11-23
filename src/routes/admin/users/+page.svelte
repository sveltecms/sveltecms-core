<script lang="ts">
    export let data:PageServerData
    // Set users store
    USERS.set(data.users)
    import type { PageServerData } from "./$types";
    import type { UserData } from "$Types";
    import type { DeleteUserLoad,DeleteUserRes } from "$Types/api";
    import { postJson } from "$Utils";
    import { USERS } from "$Stores";
    // Icons
    import PlusIcon from "$Icons/Plus.svelte";
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    // Packages
    import { newToast } from "$Packages/svelteToasts";
    // Components
    import Users from "$Comps/users/Users.svelte";
    import NoResult from "$Comps/NoResult.svelte"
    /** Handle delete user */
    async function handleDeleteUser(e:any) {
        const user:UserData = e.detail
        const apiLoadData:DeleteUserLoad = user
        const apiResponse:DeleteUserRes = await postJson("/users/delete",apiLoadData)
        // If user was delete
        if(apiResponse.ok){
            newToast({ type:"ok",msg:apiResponse.msg })
            // Update users store
            const newUsersList = $USERS.filter(data=>data._id!==user._id)
            USERS.set(newUsersList)
        }
        // Else if user was not deleted
        else newToast({ type:"error",msg:apiResponse.msg })
    }
    // Variables
    $: users = $USERS
</script>

<PageTitleLink href="/admin/users/new" title="Users" icon={PlusIcon}/>
{#if users.length > 0}
    <Users {users} on:delete={handleDeleteUser}/>
{:else}
    <NoResult title="No users" subTitle="Please add some users" href="/admin/users/new" hrefText="Create user"/>
{/if}