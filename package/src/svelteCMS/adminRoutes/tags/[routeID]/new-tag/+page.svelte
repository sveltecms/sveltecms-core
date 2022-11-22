<script lang="ts">
    const addingNewTag:boolean = true
    let tag:TagLoad = { name: "",slug: "",description: "" }
    import type { TagLoad } from "$Types";
    import type { CreateTagLoad,CreateTagRes } from "$Types/api"
    /** Handle api tag update */
    async function handleTagSave() {
        const validatortErrors = validateTag(tag)
        const validated = validatortErrors.length===0
        // If tag data was not validated
        if(!validated) { newToast({ type:"error",msg:validatortErrors[0] }) ; return }
        // Set loading
        savingUpdates = true
        // Send request
        const apiLoadData:CreateTagLoad = tag
        const apiResposone:CreateTagRes = await postJson(`/routes/${routeID}/tags/create`,apiLoadData)
        // If tag was updated
        if(apiResposone.ok){
            newToast({ type:"ok",msg:apiResposone.msg })
            await wait(1000)
            goto(`/admin/tags/${routeID}`)
        }
        // Else if tag was not updated
        else newToast({ type:"error",msg:apiResposone.msg })
        // Remove loading
        await wait(500)
        savingUpdates = false
    }
    // ------------------------------------------------------------ //
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { postJson, wait, validateTag,newSlug } from "$Utils";
    // Packages
    import { newToast } from "$Packages/svelteToasts";
    // Components
    import Button from "$Comps/Button.svelte";
    import Content from "$Comps/routes/Content.svelte";
    import LeftContent from "$Comps/routes/LeftContent.svelte";
    import RightContent from "$Comps/routes/RightContent.svelte";
    // Elements
    import Label from "$Elements/Label.svelte"
    import Input from "$Elements/Input.svelte"
    import TextArea from "$Elements/Textarea.svelte"
    // Variables
    $: routeID = $page.params.routeID
    /** Indicate if saving updates */
    let savingUpdates:boolean = false
</script>

<Content>
    <LeftContent>
        <Label text="Name"/>
        <Input placeholder="Tag name" bind:value={tag.name}/>
        <!-- Only show when adding new tag -->
        {#if addingNewTag}
            <Label text="Slug" btnText="Generate" on:click={()=>tag.slug=newSlug(tag.name)}/>
            <Input placeholder="Tag slug" bind:value={tag.slug}/>
        {/if}
        <Label text="Tag description"/>
        <TextArea placeholder="Tag description" bind:value={tag.description}/>
    </LeftContent>
    <RightContent>
        <Button text="Save changes" loading={savingUpdates} on:click={handleTagSave}/>
    </RightContent>
</Content>