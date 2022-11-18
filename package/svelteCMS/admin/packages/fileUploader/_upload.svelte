<script lang="ts">
    /** Api base url - default "/admin/api/assets" */
    export let apiBaseUrl:string
    /** Wheather file uploader is open or close */
    export let open:boolean = true
    export let showSearch:boolean = true
    import type { ApiResponse,AssetData } from "./types"
    import Image from "./_image.svelte";
    import SaveIcon from "./icons/Cloud.svelte";
    import CancelIcon from "./icons/Close.svelte";
    import UploadIcon from "./icons/Upload.svelte"
    import RotateIcon from "./icons/Rotate.svelte";
    import Spinner from "./_spinner.svelte";
    import { createEventDispatcher } from "svelte";
    /** Create event dispatch and close file uploader */
    const dispatch = createEventDispatcher()
    function sendDispatch(asset:AssetData){
        // Send event
        dispatch("select",asset)
        // Close file uploader
        open = false
    }
    /** Handle file input change */
    function handleFileChange(){
        const file = fileInput.files![0]
        fileTempSrc = URL.createObjectURL(file)
        assetName = file.name.split(".")[0]
        showSearch = false
    }
    /** Cancel file upload */
    function resetFileInput(){
        fileInput.value = ""
        fileTempSrc = ""
        assetName = ""
        showSearch = true
    }
    /** Upload new file */
    async function uploadFile(){
        const file = fileInput.files![0]
        const formData = new FormData ; formData.append("image",file)
        const apiReq = await fetch(`${apiBaseUrl}/new`,{method:"POST",body:formData,headers:{assetName}})
        const apiRes:ApiResponse = await apiReq.json()
        // If file was uploaded, send dispatch and close file uploader
        if(apiRes.ok){
            const asset:AssetData = {
                _id: apiRes._id,
                name: apiRes.name,
                path: apiRes.path,
                type: apiRes.type,
                extension: apiRes.extension
            }
            sendDispatch(asset)
        }
        // Alert any error
        else alert(apiRes.msg)
        // Reset file input after uploaded
        resetFileInput()
    }
    // Variables
    let fileInput:HTMLInputElement
    let loading:boolean = false
    let fileTempSrc:string = ""
    let assetName:string
    /** Label for upload button */
    $: label = fileTempSrc ? "Update" : "Upload"
</script>

{#if fileTempSrc}
    <Image src={fileTempSrc} bind:alt={assetName}/>
{/if}
<div class="buttons">
    {#if fileTempSrc}
        <button class="btn save" on:click={uploadFile}>
            {#if loading}<Spinner/>{/if}
            <SaveIcon/>&nbsp;Save
        </button>
        <button class="btn cancel" on:click={resetFileInput}>
            <CancelIcon/>&nbsp;Cancel
        </button>
    {/if}
    <input type="file" accept=".png,.jpg,.webp" id="file" bind:this={fileInput} on:change={handleFileChange}>
    <label class="btn" for="file">
        {#if label==="Update"}<RotateIcon size=15/>{:else}<UploadIcon/>{/if}
        &nbsp;{label}
    </label>    
</div>

<style>
    .buttons{
        display: flex;
        align-items: center;
    }
    .buttons:global(svg){ margin: 50px; }
    .btn{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        cursor: pointer;
        border: none;
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        fill: var(--buttonColor);
        font-size: 15px;
        text-align: center;
        font-weight: 400;
        padding: 10px 15px;
        border-radius: 50px;
        box-shadow: 1px 1px 4px rgba(0,0,0,.3);
    }
    .save,.cancel{ margin-right:10px }
    .cancel{ background-color: #6e3e3e }
    input[type=file]{ display: none;}
</style>
