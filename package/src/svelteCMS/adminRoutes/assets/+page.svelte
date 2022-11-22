<script lang="ts">
    export let data:PageServerData
    _assets.set(data.assets)
    import type { PageServerData } from "./$types"
    import type { AssetData } from "$Packages/fileUploader/types";
    import svelteCMS from "$svelteCMS";
    import { wait } from "$Utils";
    import { _assets } from "$Stores"
    // Icons
    import PlusIcon from "$Icons/Plus.svelte";
    // Components
    import TitleButton from "$Comps/PageTitleButton.svelte";
    import FileUploader from "$Packages/fileUploader/FileUploader.svelte";
    import Assets from "$Comps/shared/assets/Assets.svelte"
    import Button from "$Comps/Button.svelte"
    import PopUpBox from "$Comps/PopUpBox.svelte"
    /** Handle file selected from file uploader */
    async function handleFileSelect(e:any) {
        const selectedAsset:AssetData = e.detail
        // Check if selected assets exists in assets list
        const assetInAssets = assets.find(data=>data._id===selectedAsset._id)
        // Add selected asset to assets list
        if(!assetInAssets){
            _assets.set([...$_assets,selectedAsset])
            assets = [...assets,selectedAsset]
        }
    }
    // Variables
    /** Indicate if file uploader is open or not */
    let isFileUploaderOpen:boolean = false
    let loading:boolean = false
    let assets = data.assets
    const assetsApiBasePath = `${svelteCMS.config.apiBasePath}/assets`
    let isPopUpBoxOpen = false
</script>

<PopUpBox bind:open={isPopUpBoxOpen}>
    <h2>Hello</h2>
</PopUpBox>

<FileUploader bind:open={isFileUploaderOpen} apiBaseUrl={assetsApiBasePath} on:select={handleFileSelect}/>
<TitleButton title="All Assets" on:click={()=>isFileUploaderOpen=true} icon={PlusIcon}/>
<Assets {assets}/>
<Button {loading} text="Load more" --width="fit-content"/>