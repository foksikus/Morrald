<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import kaizenLogo from "./assets/Kaizen-2.svg";
  import SearchBar from "./lib/SearchBar.svelte";
  import { type Item, type Store } from "./lib/store.interface";

  // Import the `onMount` lifecycle hook from Svelte
  import { onMount } from "svelte";
    import { formatNumber } from "./lib/number.utils";
    import ItemCards from "./lib/ItemCards.svelte";

  let shownData: ShownItemInfo[] = [];
  let responseData: Store[] = [];
  let allnames: string[] = [];

  // Replace 'YOUR_ENDPOINT_URL' with the actual URL of your API endpoint
  const endpointUrl = "http://139.59.208.141:4200/api/items";



  // Function to fetch data from the endpoint
  async function fetchData() {
    try {
      const response = await fetch(endpointUrl);
      const data = await response.json();
      responseData = Object.values(data); // Update the reactive variable with the fetched data
      responseData.forEach((s) => {
        s.items.forEach((i) => {
          i.cards = i.cards.filter((c) => c.id > 0);
          i.perks = i.perks.filter((c) => c.id > 0);
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  type ShownItemInfo = Item & { store: string } & { location: number[] };

  const idk = (s: Store) => {
    return s.items.map((item) => {
      return {
        ...item,
        store: s.name,
        location: s.position,
      } as ShownItemInfo;
    });
  };

  function handleSearch(event: CustomEvent<{ query: string }>) {
    const query = event.detail.query;

    const itemsOfStore: ShownItemInfo[] = responseData
      .filter((store) => {
        return store.name.toLowerCase().includes(query.toLowerCase());
      })
      .flatMap(idk);

    const itemsOfItem: ShownItemInfo[] = responseData.flatMap((s) => {
      const items = s.items.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase());
      });
      return items.map((item) => {
        return {
          ...item,
          store: s.name,
          location: s.position,
        } as ShownItemInfo;
      });
    });

    const itemsWithCard = responseData.flatMap((s) => {
      const items = s.items.filter((item) => {
        return item.cards.some((card) =>
          card.name.toLowerCase().includes(query.toLowerCase())
        );
      });
      return items.map((item) => {
        return {
          ...item,
          store: s.name,
          location: s.position,
        } as ShownItemInfo;
      });
    });

    const itemsWithPerk = responseData.flatMap((s) => {
      const items = s.items.filter((item) => {
        return item.perks.some((perk) =>
          perk.name.toLowerCase().includes(query.toLowerCase())
        );
      });
      return items.map((item) => {
        return {
          ...item,
          store: s.name,
          location: s.position,
        } as ShownItemInfo;
      });
    });

    shownData = [
      ...new Set([
        ...itemsOfStore,
        ...itemsOfItem,
        ...itemsWithCard,
        ...itemsWithPerk,
      ]),
    ];
  }

  // Call the fetchData function when the component is mounted
  onMount(() => {
    fetchData().then(() => {
      const shopnames = responseData.map((store) => store.name);
      const itemnames = responseData.flatMap((store) =>
        store.items.map((item) => item.name)
      );
      const cardnames = responseData.flatMap((store) =>
        store.items.flatMap((item) => item.cards.map((card) => card.name))
      );
      const perknames = responseData.flatMap((store) =>
        store.items.flatMap((item) => item.perks.map((perk) => perk.name))
      );
      allnames = [
        ...new Set([...shopnames, ...itemnames, ...cardnames, ...perknames]),
      ].filter((name) => name !== "");
    });
  });
</script>

<main>
  <div>
    <img class="logo" src={kaizenLogo} alt="Kaizen Logo" />
    <!-- <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a> -->
  </div>
  <h2 style="margin: 0;">Kaizen</h2>
  <h1 style="margin: 0.5rem 1rem 3rem 1rem">Harold</h1>
</main>
<div style="width:650px; margin-bottom:15px">
  <SearchBar possibleSuggestions={allnames} on:search={handleSearch} />
</div>

{#if shownData.length === 0}
  <p>No results found</p>
{:else}
   {#each shownData as d}
  <ItemCards item={d} />
  {/each}
  <!-- <table>
    <thead>
      <tr>
        <th style="width: 0; padding:0; margin:0" />
        <th style="width: 0; padding:0; margin:0" />
        <th>Name</th>
        <th>Cards</th>
        <th class="prize-column">Price</th>
      </tr>
    </thead>
    <tbody>
      {#each shownData as item}
        <tr>
          <td>{item.count}x</td>
          <td style="padding: 10px 0 10px 10px;">
            {#if item.refiningLevel > 0}
              <span>+{item.refiningLevel}</span>
            {/if}
          </td>
          <td
            style="padding: 10px 10px 10px 5px;"
            title="{item.store} | {item.location}"
          >
            {item.name}
          </td>
          <td>
            {#each item.cards as card}
              <img
                src="https://file5s.ratemyserver.net/items/small/card.gif"
                alt="card-icon"
                title={card.name}
              />
            {/each}
          </td>
          <td class="prize-column">{formatNumber(item.price)}z</td>
        </tr>
      {/each}
    </tbody>
  </table> -->
{/if}

<style>
  .prize-column {
    text-align: right;
  }
  table {
    text-align: left;
  }

  /* Style for the table */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  /* Style for table header row */
  thead th {
    border-bottom: 2px solid #ddd;
    font-weight: bold;
    padding: 10px;
    text-align: left;
  }

  /* Style for table data cells */
  tbody td {
    border-bottom: 1px solid #ddd;
    padding: 10px;
  }

  /* Alternating row colors for better readability */
  tbody tr:nth-child(even) {
    background-color: #383838;
  }

  /* Hover effect for table rows */
  tbody tr:hover {
    background-color: #3b3b3b;
  }

  .logo {
    height: 12em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #3876b9aa);
  }
</style>
