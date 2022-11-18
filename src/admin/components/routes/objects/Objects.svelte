<script lang="ts">
    export let objects:RouteObjectData[]
    import type { RouteObjectData } from "$Types";
    import Object from "./Object.svelte";
</script>

<div class="objects">
    {#each objects as object}
        <Object {object} on:delete />
    {/each}
</div>

<style>
    .objects{
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
    }
</style>