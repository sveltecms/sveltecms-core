<script lang="ts">
    export let data:PageServerData
    ASSETS.set(data.assets)
    import type { PageServerData } from "./$types"
    import type { AssetData } from "$Packages/fileUploader/types";
    import type { FetchAssetsLoad,FetchAssetsRes } from "$Types/cms";
    import svelteCMS from "$svelteCMS";
    import { ASSETS } from "$Stores"
    import { wait,postJson } from "$Utils"
    // Icons
    import PlusIcon from "$Icons/Plus.svelte";
    // Components
    import TitleButton from "$Comps/PageTitleButton.svelte";
    import FileUploader from "$Packages/fileUploader/FileUploader.svelte";
    import Assets from "$Comps/shared/assets/Assets.svelte"
    import Button from "$Comps/Button.svelte"
    import NoResult from "$Comps/NoResult.svelte";
    /** Handle file selected from file uploader */
    async function handleFileSelect(e:any) {
        const selectedAsset:AssetData = e.detail
        // Check if selected assets exists in assets list
        const assetInAssets = assets.find(data=>data._id===selectedAsset._id)
        // Add selected asset to assets list
        if(!assetInAssets){
            ASSETS.set([...$ASSETS,selectedAsset])
            assets = [...assets,selectedAsset]
        }
    }
    /** Load more assets */
    async function loadMoreAssets() {
        // Set loading more assets
        isGettingMoreAssets = true
        // Update page number
        pageNumber = pageNumber+1
        // Send api request
        const apiLoad:FetchAssetsLoad = { filter:{},count:svelteCMS.config.assetsPerPage,pageNumber }
        const apiResponse:FetchAssetsRes = await postJson("/assets",apiLoad) 
        if(apiResponse.length>0){
            if(apiResponse.length<svelteCMS.config.assetsPerPage) resetStages()
            // Wait 500 milliseconds
            await wait(500)
            // Marge assets with response assets
            ASSETS.set([...$ASSETS,...apiResponse])
        }
        // Reset stages
        else await resetStages()
        // Remove loading more assets
        isGettingMoreAssets = false
    }
    /** Reset stages */
    async function resetStages(){
        // Wait 500 milliseconds
        await wait(500)
        showLoadMoreBtn = false
        pageNumber = 1
    }
    // Variables 
    const assetsApiBasePath = `${svelteCMS.urlBases.api}/assets`
    /** Indicate if file uploader is open or not */
    let isFileUploaderOpen:boolean = false
    let assets = data.assets
    let showLoadMoreBtn:boolean = $ASSETS.length >= svelteCMS.config.assetsPerPage
    let pageNumber = 1
    /** Indicate when loading more assets */
    let isGettingMoreAssets = false
</script>

<FileUploader bind:open={isFileUploaderOpen} apiBaseUrl={assetsApiBasePath} on:select={handleFileSelect}/>
{#if $ASSETS.length > 0}
    <TitleButton title="All Assets" on:click={()=>isFileUploaderOpen=true} icon={PlusIcon}/>
    <Assets assets={$ASSETS}/>
    {#if showLoadMoreBtn}
        <Button loading={isGettingMoreAssets} text="Load more" centerBtn={true} --width="fit-content" on:click={loadMoreAssets}/>
    {/if}
{:else}
    <NoResult title="No assets" subTitle="Please some assets" href="/admin/assets" hrefText="Add assets" on:click={()=>isFileUploaderOpen=true}/>
{/if}