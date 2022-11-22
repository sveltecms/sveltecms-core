<script lang="ts">
    import svelteCMS from "$svelteCMS"
    import type { CategoryLoad } from "$Types";
    import type { CreateCategoryLoad,CreateCategoryRes } from "$Types/api"
    const addingNewCategory:boolean = true
    let category:CategoryLoad = { name: "",slug: "",description: "",image:svelteCMS.defaults.asset }
    
    /** Handle api category update */
    async function handleCategorySave() {
        const validatortErrors = validateCategory(category)
        const validated = validatortErrors.length===0
        // If category data was not validated
        if(!validated) { newToast({ type:"error",msg:validatortErrors[0] }) ; return }
        // Set loading
        savingUpdates = true
        // Send request
        const apiLoadData:CreateCategoryLoad = category
        const apiResposone:CreateCategoryRes = await postJson(`/routes/${routeID}/categories/create`,apiLoadData)
        // If category was updated
        if(apiResposone.ok){
            newToast({ type:"ok",msg:apiResposone.msg })
            await wait(1000)
            goto(`/admin/categories/${routeID}`)
        }
        // Else if category was not updated
        else newToast({ type:"error",msg:apiResposone.msg })
        // Remove loading
        await wait(500)
        savingUpdates = false
    }
    // ------------------------------------------------------------ //
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { postJson, wait, validateCategory,newSlug } from "$Utils";
    // Packages
    import { newToast } from "$Packages/svelteToasts";
    import FileUploader from "$Packages/fileUploader/FileUploader.svelte";
    import type { AssetData } from "$Packages/fileUploader/types";
    // Components
    import Button from "$Comps/Button.svelte";
    import ImagePreview from "$Comps/routes/ImagePreview.svelte";
    import Content from "$Comps/routes/Content.svelte";
    import LeftContent from "$Comps/routes/LeftContent.svelte";
    import RightContent from "$Comps/routes/RightContent.svelte";
    // Elements
    import Label from "$Elements/Label.svelte"
    import Input from "$Elements/Input.svelte"
    import TextArea from "$Elements/Textarea.svelte"
    /** Handle category image update */
    function handleSelectedImage(e:any){
        const newImage:AssetData = e.detail
        category.image = newImage
    }
    // Variables
    $: routeID = $page.params.routeID
    /** Indicate if saving updates */
    let savingUpdates:boolean = false
    /** Is file uploader open */
    let isFileUploaderOpen:boolean = false
</script>

<FileUploader bind:open={isFileUploaderOpen} on:select={handleSelectedImage}/>
<Content>
    <LeftContent>
        <Label text="Name"/>
        <Input placeholder="Category name" bind:value={category.name}/>
        <!-- Only show when adding new category -->
        {#if addingNewCategory}
            <Label text="Slug" btnText="Generate" on:click={()=>category.slug=newSlug(category.name)}/>
            <Input placeholder="Category slug" bind:value={category.slug}/>
        {/if}
        <Label text="Category description"/>
        <TextArea placeholder="Category description" bind:value={category.description}/>
    </LeftContent>
    <RightContent>
        <ImagePreview image={category.image}/>
        <Button text="Update image" on:click={()=>isFileUploaderOpen=true}/>
        <Button text="Save changes" loading={savingUpdates} on:click={handleCategorySave}/>
    </RightContent>
</Content>