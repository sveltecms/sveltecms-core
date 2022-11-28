<script lang="ts">
    export let element:RouteValueData['elements'][0]
    import type { RouteValueData } from "$Types"
    import { createEventDispatcher } from "svelte";
    // Icons
    import ArrowUp from "$Icons/ArrowUpCircle.svelte"
    import ArrowDown from "$Icons/ArrowDownCircle.svelte"
    import TrashIcon from "$Icons/Trash.svelte";
    /** Delete element */
    function deleteElement(){ dispatcher("delete",element) }
    /** Move element */
    function moveElement(direction:"up"|"down"){ dispatcher("move",{element,direction}) }
    // Variables
    const dispatcher = createEventDispatcher()
</script>

<div class="element">
    <div class="actions">
        <div class="icon" data-label="Move up" on:click={()=>moveElement("up")}>
            <ArrowUp />
        </div>
        <div class="icon" data-label="Move down" on:click={()=>moveElement("down")}>
            <ArrowDown />
        </div>
    </div>
    <span class="name">{element.name}</span>
    <div class="icon red" data-label="Delete" on:click={deleteElement}>
        <TrashIcon />
    </div>
</div> 

<style>
    .element{
        width: 100%;
        font-size: 15px;
        font-weight: 300;
        background-color: #2e323a6b;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
        box-shadow: var(--boxShadow2);
    }
    .actions{
        display: flex;
        align-items: center;
    }
    .name{
        font-size: 15px;
        font-weight: 300;
        color: var(--textColor);
    }
    .icon:nth-child(1){ margin-right: 10px;}
    .icon{
        flex: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        min-width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: var(--mainColor);
        fill: #fff;
        box-shadow: var(--boxShadow2);
    }
    .icon.red{
        background-color: #906565;
    }
</style>