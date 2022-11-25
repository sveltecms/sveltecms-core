<script lang="ts">
    export let data:PageServerData
    // Set users store
    USERS.set(data.users)
    import type { PageServerData } from "./$types";
    import type { UserData } from "$Types";
    import type { DeleteUserLoad,DeleteUserRes } from "$Types/api";
    import type { FetchUsersLoad,FetchUsersRes } from "$Types/cms";
    import { wait,postJson } from "$Utils";
    import { USERS } from "$Stores";
    import svelteCMS from "$svelteCMS";
    // Icons
    import PlusIcon from "$Icons/Plus.svelte";
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    // Packages
    import { newToast } from "$Packages/svelteToasts";
    // Components
    import Users from "$Comps/users/Users.svelte";
    import NoResult from "$Comps/NoResult.svelte"
    import Button from "$Comps/Button.svelte"
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
    /** Load more users */
    async function loadMoreUsers() {
        // Set loading more users
        loadingMoreUsers = true
        // Update page number
        pageNumber = pageNumber+1
        // Send api request
        const apiLoad:FetchUsersLoad = { filter:{},count:svelteCMS.config.usersPerPage,pageNumber }
        const apiResponse:FetchUsersRes = await postJson("/users",apiLoad) 
        if(apiResponse.length>0){
            if(apiResponse.length<svelteCMS.config.usersPerPage) resetStages()
            // Wait 500 milliseconds
            await wait(500)
            // Marge users with response users
            USERS.set([...$USERS,...apiResponse])
        }
        // Reset stages
        else await resetStages()
        // Remove loading more users
        loadingMoreUsers = false
    }
    /** Reset stages */
    async function resetStages(){
        // Wait 500 milliseconds
        await wait(500)
        showLoadMoreBtn = false
        pageNumber = 1
    }
    // Variables
    /** Indicate when loading more users */
    let loadingMoreUsers:boolean = false
    /** Current page number */
    let pageNumber:number = 1
    /** Indicate if show load more button or not */
    let showLoadMoreBtn:boolean = $USERS.length >= svelteCMS.config.usersPerPage
</script>

<PageTitleLink href="/admin/users/new" title="Users" icon={PlusIcon}/>
{#if $USERS.length > 0}
    <Users users={$USERS} on:delete={handleDeleteUser}/>
    {#if showLoadMoreBtn}
        <Button loading={loadingMoreUsers} --width="fit-content" on:click={loadMoreUsers}/>
    {/if}
{:else}
    <NoResult title="No users" subTitle="Please add some users" href="/admin/users/new" hrefText="Create user"/>
{/if}