<script lang="ts">
    /** Api base url - default "/admin/api/assets" */
    export let apiBaseUrl:string
    /** Whether file uploader is open or close */
    export let open:boolean
    export let searchValue:string = ""
    import type { AssetData,SearchLoad } from "./types"
    import SearchIcon from "./icons/Search.svelte"
    import CloseIcon from "./icons/Close.svelte"
    import Assets from "./assets/Assets.svelte";
    /** Clear input value */
    function resetSearch(){
        searchValue = ""
        assets = []
    }
    /** Search assets */
    async function searchAssets() {
        const apiLoad:SearchLoad = { assetName:searchValue }
        const apiReq = await fetch(apiEndpoint,{method:"POST",headers:{"Content-Type":"Application/json"},body:JSON.stringify(apiLoad)})
        const apiRes:AssetData[] = await apiReq.json()
        assets = [...apiRes]
    }
    const apiEndpoint:string = `${apiBaseUrl}/search`
    let assets:AssetData[] = []
</script>

<div class="searchWrap">
    <input class="searchInput" type="text" placeholder="Search file..." bind:value={searchValue} on:keydown={searchAssets}>
    <div class="icon" on:click={resetSearch} on:keypress={resetSearch}>
        {#if searchValue.trim().length>0}
            <CloseIcon />
        {:else}
            <SearchIcon /> 
        {/if}
    </div>
</div>
<Assets {assets} {apiBaseUrl} bind:open on:select/>

<style>
    .searchWrap{
        width: 100%;
        display: flex;
        align-items: center;
        background-color: var(--antiBodyBg);
        border-radius: 5px;
        overflow: hidden;
        padding: 10px 15px;
        margin-bottom: 10px;
    }
    .searchInput{
        width: 100%;
        border: none;
        background-color: transparent;
        color: var(--textColor);
        font-size: 17px;
        font-weight: 300;
    }
    .searchInput::placeholder{
        color: var(--textColor);
    }
    .searchInput:focus{
        outline: none;
    }
    .icon{
        cursor: pointer;
        fill: var(--iconColor);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>