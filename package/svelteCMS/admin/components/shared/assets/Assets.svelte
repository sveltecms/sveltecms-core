<script lang="ts">
    export let assets:AssetData[]
    import { fade } from "svelte/transition"
    import type { AssetData } from "$Packages/fileUploader/types";
    import Asset from "./Asset.svelte";
</script>

<div class="assets" in:fade="{{duration:200}}">
    {#each assets as asset (asset._id)}
        <Asset {asset} on:click/>
    {/each}
</div>

<style lang="scss">
    .assets{
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 10px;
    }
</style>