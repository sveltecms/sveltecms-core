<script lang="ts">
    export let data:PageData
    // Add object data to routeData elements
    for(const element of data.routeData.elements){
        element.value = data.objectData[element.ID]
    }
    import type { PageData } from "./$types"
    /** Api path to add or update object */
    let apiPath = `/routes/${data.routeData.ID}/objects/update`
    /** Indicate if we are adding or updating */
    const addingNewObject = false
    let categories:CategoryData[] = data.objectData.categories ? data.objectData.categories : []
    let tags:TagData[] = data.objectData.tags ? data.objectData.tags : []
    //---------------------------------------
    import type { UpdateRouteObjectLoad,UpdateRouteObjectRes } from "$Types/api"
    import type { CategoryData,TagData } from "$Types"
    import { goto } from "$app/navigation";
    // Utils
    import { newSlug,validateNewObject,postJson,wait } from "$Utils"
    // Icons
    import AssetIcon from "$Icons/Images.svelte"
    import UpdateAssetIcon from "$Icons/RotateRight.svelte"
    // Packages
    import { newToast } from "$Packages/svelteToasts"
    import EditorJs from "$Packages/editorJs/EditorJs.svelte"
    import FileUploader from "$Packages/fileUploader/FileUploader.svelte";
    import type { AssetData } from "$Packages/fileUploader/types"
    // Elements
    import Button from "$Elements/Button.svelte";
    import Label from "$Elements/Label.svelte";
    import Input from "$Elements/Input.svelte";
    import Textarea from "$Elements/Textarea.svelte"
    import InputNumber from "$Elements/InputNumber.svelte";
    import Status from "$Elements/Status.svelte";
    import SearchCategories from "$Elements/searchCategories/Search.svelte"
    import SearchTags from "$Elements/searchTags/Search.svelte"
    // Comps
    import Meta from "$Comps/Meta.svelte"
    // Route components
    import Content from "$Comps/routes/Content.svelte";
    import LeftContent from "$Comps/routes/LeftContent.svelte";
    import RightContent from "$Comps/routes/RightContent.svelte";
    import ImagePreview from "$Comps/routes/ImagePreview.svelte";
    /** Auto generate slug, we will use title  */
    function generateSlug(){ 
        routeData.elements.forEach(element=>{
            if(element.type==="slug"){
                const title = routeData.elements.find(data=>data.type==="input")
                if(title){
                    const value = newSlug(title!.value)
                    element.domElement.value = value
                    element.value = value
                }
            }
        })
    }
    /** Handle file select from fileUploader */
    function handleFileSelected(e:any){
        const asset:AssetData = e.detail
        routeData.elements.forEach(element=>{
            if(element.type==="image") element.value = asset
        })
        routeData = {...routeData}
    }
    /** Handle publish or update object */
    async function handlePublish() {
        // Add loading to button
        loading = true
        // Validate object before adding it
        const validatorErrors = validateNewObject(routeData.elements)
        /** If elements were validated or not */
        const validated = validatorErrors.length===0
        if(!validated){
            newToast({type:"error",msg:validatorErrors[0]})
            // Remove loading from button and return to stop function
            loading = false ; return
        }
        // Add categories if it was selected
        if(routeData.includeCategories==="yes"){
            routeData.elements.push({
              ID: "categories",
              name: "Categories",
              type: "categories",
              value: categories
            })
        }
        // Add categories if it was selected
        if(routeData.includeTags==="yes"){
            routeData.elements.push({
              ID: "tags",
              name: "Tags",
              type: "tags",
              value: tags
            })
        }
        // Create or update object
        const apiLoadData:UpdateRouteObjectLoad = { objectID:data.objectData._id,elements:routeData.elements }
        const apiResponse:UpdateRouteObjectRes = await postJson(apiPath,apiLoadData)
        // If object was create or updated
        if(apiResponse.ok){
            newToast({type:"ok",msg:apiResponse.msg})
            await wait(1000)
            goto(`/admin/routes/${routeData.ID}`)
        }
        // If object was not create or updated
        else{ newToast({type:"error",msg:apiResponse.msg}) }
        // Wait some time
        await wait(500)
        // Remove loading from button
        loading = false
    }
    // If adding new object, clean default values for elements
    if(addingNewObject){
        for(const element of data.routeData.elements){
            if(element.type==="status") element.value = "public"
            else element.value = ""
        }
    }
    // Variables
    $: routeData = data.routeData
    // routeData.elements
    let fileUploaderOpen:boolean = false
    /** loading represent if publishing or not */
    let loading:boolean
    /** Use to hide and show search input for categories */
    let showSearchCategories:boolean = false
    /** Use to hide and show search input for tags */
    let showSearchTags:boolean = false
    /** Publish button text */
    const publishBtnText = addingNewObject ? "Publish" : "Update"
</script>

<Meta {...routeData.meta}/>
<FileUploader on:select={handleFileSelected} bind:open={fileUploaderOpen}/>
<Content>
    <LeftContent>
        {#each routeData.elements as element}
            {#if element.type === "input"}
                <Label text={element.name}/>
                <Input bind:value={element.value} placeholder={element.name}/>
            {:else if element.type === "textArea"}
                <Label text={element.name}/>
                <Textarea bind:value={element.value} placeholder={element.name}/>
            {:else if element.type === "inputNumber"}
                <Label text={element.name}/>
                <InputNumber bind:value={element.value} placeholder={element.name}/>
            {:else if element.type === "slug"}
                <Label text={element.name} btnText={element.type==="slug"?"generate":""} on:click={generateSlug}/>
                <Input bind:element={element.domElement} bind:value={element.value} placeholder={element.name}/>
            {:else if element.type === "content"}
                <Label text={element.name}/>
                <EditorJs bind:editorJSData={element.value} defaultData={element.value}/>
            {/if}
        {/each}
    </LeftContent>
    <RightContent>
        <!-- Categories -->
        {#if routeData.includeCategories==="yes"}
            {@const btnText = showSearchCategories?"Close":"Add"}
            <Label text="Categories" {btnText} on:click={()=>showSearchCategories=!showSearchCategories}/>
            <SearchCategories {routeData} bind:categories {showSearchCategories}/>
        {/if}
        <!-- Tags -->
        {#if routeData.includeTags==="yes"}
            {@const btnText = showSearchTags?"Close":"Add"}
            <Label text="Tags" {btnText} on:click={()=>showSearchTags=!showSearchTags}/>
            <SearchTags {routeData} bind:tags {showSearchTags}/>
        {/if}
        <!-- Route elements -->
        {#each routeData.elements as element}
            <!-- Status will always be added by default -->
            {#if element.type === "status"}
                <Label text={element.name} />
                <Status bind:value={element.value}/>
            <!-- Image (Asset) can only be display on aside(side bar) for css looks -->
            {:else if element.type === "image"}
                <Label text={element.name} />
                {#if element.value}
                    <ImagePreview bind:image={element.value} />
                {/if}
                <Button text={element.value?"Update image":"Upload image"} icon={element.value?UpdateAssetIcon:AssetIcon} on:click={()=>fileUploaderOpen=true}/>
            {/if}
        {/each}
        <Button text={publishBtnText} on:click={handlePublish} bind:loading/>
    </RightContent>
</Content>