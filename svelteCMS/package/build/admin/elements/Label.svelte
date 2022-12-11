<script lang="ts">
    /** Label text */
    export let text:string
    /** If button text was passed, it will us btnText as button text */
    export let btnText:string = ''
</script>

<div class="label">
    {text}
    {#if btnText}
        <button on:click>{btnText}</button>
    {/if}
</div>

<style lang="scss">
    .label{
        margin:0 0 15px 15px;
        color: var(--textColor);
        font-size: 18px;
        font-weight: 400;
        position: relative;
        text-transform: capitalize;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &::before{
            content: "";
            position: absolute;
            left: -15px;
            height: 100%;
            width: 4px;
            border-radius: 4px;
            background-color: #066a9b40;
        }
    }
    button{
        cursor: pointer;
        text-transform: uppercase;
        border: none;
        padding: 7px 15px;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 600;
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        fill: var(--buttonColor);
        box-shadow: var(--boxShadow);
        display: flex;
        align-items: center;
        // Hover
        transition: transform 0.3s ease-in-out;
        &:hover{ transform: scale(1.05)}
    }
</style>