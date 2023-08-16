<script lang="ts">
    // import {createEventDispatcher} from "svelte";
    import {type Item} from "./store.interface";
    export let item: Item;
</script>
<style></style>
<!-- https://file5s.ratemyserver.net/items/small/7972.gif -->
<!-- https://file5s.ratemyserver.net/items/large/7972.gif -->
<!-- <img src="https://file5s.ratemyserver.net/items/small/{item.id}.gif" alt=""> -->
<b>{item.name}</b> <small>({item.id})</small>
{item.price}z
{#if item.cards.length > 0}
    <div>
        <b>Card(s):</b>
        {#each item.cards as card}
            <div>
                {card.name} <small>({card.id})</small>
            </div>
        {/each}
    </div>
{/if}
{#if item.perks.length > 0}
    <div>
        <b>Perk(s):</b>
        {#each item.perks as perk}
            <div>
                name: {perk.name} <small>({perk.id})</small>
            </div>
        {/each}
    </div>
{/if}