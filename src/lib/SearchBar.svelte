<!-- SearchBar.svelte -->
<script lang="ts">
    import {createEventDispatcher} from "svelte";
    let searchQuery = "";
    export let possibleSuggestions: string[] = [];
    let shownSuggestions: string[] = [];
    let open = false;
    let blockBlur = false;
    const dispatch = createEventDispatcher();

    function updateQuery(event: any) {
        searchQuery = event.target.value;
        filterSuggestions();
    }

    function selectSuggestion(suggestion: string) {
        searchQuery = suggestion;
        console.log("Selected suggestion", suggestion);
        open = false;
        handleSuggestionClick();
    }

    function filterSuggestions() {
        shownSuggestions = possibleSuggestions
            .filter((suggestion) =>
                suggestion.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 5);
    }

    function handleSuggestionClick() {
        dispatch("search", { query: searchQuery })
    }

    function handleKeyUp(event: KeyboardEvent) {
        
        switch (event.key) {
            case "Escape":
                open = false;
                searchQuery = "";
                shownSuggestions = [];
                break;
            case "ArrowDown":
                break;
            case "Enter":
                handleSuggestionClick();
                break;
            default:
                break;
        }
    }

    function handleOnBlur(
        event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }
    ) {
        if (blockBlur) return;
        open = false;
    }
</script>

<div class="wrapper">
    <div id="input-wrapper">
        <input
            id="input"
            type="search"
            autocomplete="off"
            spellcheck="false"
            role="combobox"
            aria-controls="matches"
            placeholder="Item- oder Shopnamen"
            aria-expanded="false"
            aria-live="polite"
            class:open={open && searchQuery.length > 0}
            value={searchQuery}
            on:input={updateQuery}
            on:focus={() => (open = true)}
            on:blur={handleOnBlur}
            on:keyup={handleKeyUp}
        />
        {#if open}
            {#if shownSuggestions.length === 0 && searchQuery.length > 0}
                <div class="suggs">
                    <div class="sugg-item">Keine Ergebnisse</div>
                </div>
            {:else}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                    class="suggs"
                    on:mouseenter={() => (blockBlur = true)}
                    on:mouseleave={() => (blockBlur = false)}
                >
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    {#each shownSuggestions as suggestion}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div
                            on:click={() => selectSuggestion(suggestion)}
                            class="sugg-item hoverble"
                        >
                            {suggestion}
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    .suggs {
        background-color: white;
        border-radius: 0 0 var(--ntp-realbox-border-radius)
            var(--ntp-realbox-border-radius);
        box-shadow: var(--cr-realbox-shadow);
        font-size: 16px;
        left: 0;
        /* max-height: 300px; */
        /* overflow-y: auto; */
        /* position: absolute; */
        /* top: 100%; */
        width: 100%;
        z-index: 1;
        color: black;
        text-align: left;
    }

    .sugg-item {
        font-size: 16px;
        padding: 8px 16px;
        outline: 0;
        padding-inline-end: calc(
            var(--ntp-realbox-voice-icon-offset) + var(--ntp-realbox-icon-width) +
                var(--ntp-realbox-inner-icon-margin)
        );

        padding-inline-start: 52px;
    }
    .hoverble {
        cursor: pointer;
    }
    .hoverble:hover {
        background-color: whitesmoke;
    }
    .sugg-item:last-child {
        border-radius: 0 0 var(--ntp-realbox-border-radius)
            var(--ntp-realbox-border-radius);
    }

    .wrapper {
        --cr-realbox-height: 44px;
        --cr-realbox-min-width: var(--ntp-search-box-width);
        --cr-realbox-shadow: 0 1px 6px 0 var(--color-realbox-shadow);
        --cr-realbox-width: var(--cr-realbox-min-width);
        --ntp-realbox-border-radius: calc(0.5 * var(--cr-realbox-height));
        --ntp-realbox-icon-width: 26px;
        --ntp-realbox-inner-icon-margin: 8px;
        --ntp-realbox-voice-icon-offset: 16px;
        border-radius: var(--ntp-realbox-border-radius);
        box-shadow: var(--cr-realbox-shadow);
        font-size: 16px;
        height: var(--cr-realbox-height);
        width: var(--cr-realbox-width);
        background-color: white;
    }
    #input-wrapper {
        height: 100%;
        position: relative;
    }

    input.open {
        border-radius: var(--ntp-realbox-border-radius)
            var(--ntp-realbox-border-radius) 0 0;
    }

    input {
        background-color: white;
        border-radius: var(--ntp-realbox-border-radius);
        border: none;
        color: black;
        font-family: inherit;
        font-size: inherit;
        height: 100%;
        outline: 0;
        padding-inline-end: calc(
            var(--ntp-realbox-voice-icon-offset) + var(--ntp-realbox-icon-width) +
                var(--ntp-realbox-inner-icon-margin)
        );
        padding-inline-start: 52px;
        position: relative;
        width: 100%;
    }
</style>
