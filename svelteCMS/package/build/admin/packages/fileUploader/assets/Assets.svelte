<script lang="ts">
    /** Api base url - default "/admin/api/assets" */
    export let apiBaseUrl:string
    /** Whether file uploader is open or close */
    export let open:boolean
    export let assets:AssetData[]
    import type { AssetData } from "../types"
    import Asset from "./Asset.svelte";
</script>

<div class="assets">
    {#each assets as asset (asset._id)}
        <Asset {asset} {apiBaseUrl} bind:open on:select/>
    {/each}
</div>

<style>
    .assets{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;
    }
</style>