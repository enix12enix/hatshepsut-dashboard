<script lang="ts">
  export let name: string;
  export let width: string | number = "24";
  export let height: string | number = "24";
  export let stroke_width: string | number = "2";
  export let stroke: string = "currentColor";
  export let fill: string = "none";
  export let stroke_linecap: "round" | "butt" | "square" | "inherit" = "round";
  export let stroke_linejoin: "round" | "miter" | "bevel" | "inherit" | "arcs" | "miter-clip" = "round";
  export let className: string = "";
</script>

<svelte:options accessors={true} />

<svg
  xmlns="http://www.w3.org/2000/svg"
  class="icon icon-tabler {className}"
  {width}
  {height}
  viewBox="0 0 24 24"
  stroke-width={stroke_width}
  {stroke}
  {fill}
  stroke-linecap={stroke_linecap}
  stroke-linejoin={stroke_linejoin}
>
  {#if name === "list-check"}
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M3.5 5.5l1.5 -1.5l2.5 2.5"></path>
    <path d="M3.5 11.5l1.5 -1.5l2.5 2.5"></path>
    <path d="M3.5 17.5l1.5 -1.5l2.5 2.5"></path>
    <path d="M11 6l9 0"></path>
    <path d="M11 12l9 0"></path>
    <path d="M11 18l9 0"></path>
  {:else if name === "check"}
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M5 12l5 5l10 -10"></path>
  {:else if name === "x"}
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M18 6l-12 12"></path>
    <path d="M6 6l12 12"></path>
  {:else if name === "ban"}
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M5.7 5.7l12.6 12.6"></path>
  {/if}
</svg>