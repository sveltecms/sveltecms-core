<script lang="ts">
    // ------------------------------
    export let data:PageServerData
    import type { PageServerData } from "./$types"
    import type { UpdateCategoryLoad, UpdateCategoryRes } from "$Types/api"
    import { goto } from "$app/navigation";
    import { postJson, wait } from "$Utils";
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
    /** Handle api category update */
    async function handleCategoryUpdate() {
        // Set loading
        savingUpdates = true
        // Send request
        const apiLoadData:UpdateCategoryLoad = category
        const apiResponse:UpdateCategoryRes = await postJson(`/routes/${routeID}/categories/update`,apiLoadData)
        // If category was updated
        if(apiResponse.ok){
            newToast({ type:"ok",msg:apiResponse.msg })
            await wait(1000)
            goto(`/admin/categories/${routeID}`)
        }
        // Else if category was not updated
        else newToast({ type:"error",msg:apiResponse.msg })
        // Remove loading
        await wait(500)
        savingUpdates = false
    }
    // Variables
    $: routeID = data.routeID
    $: category = data.category
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
        <Label text="Category description"/>
        <TextArea placeholder="Category description" bind:value={category.description}/>
    </LeftContent>
    <RightContent>
        <ImagePreview image={category.image}/>
        <Button text="Update image" on:click={()=>isFileUploaderOpen=true}/>
        <Button text="Save changes" loading={savingUpdates} on:click={handleCategoryUpdate}/>
    </RightContent>
</Content>