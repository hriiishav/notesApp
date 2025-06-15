<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let searchQuery = '';

  function handleSearch() {
    dispatch('search', searchQuery);
  }

  function clearSearch() {
    searchQuery = '';
    dispatch('search', '');
  }
</script>

<div class="relative w-full max-w-md">
  <div class="relative">
    <input
      type="text"
      bind:value={searchQuery}
      on:input={handleSearch}
      placeholder="Search notes..."
      class="input-field pl-10 pr-10"
    />
    
    <!-- Search Icon -->
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
    
    <!-- Clear Button -->
    {#if searchQuery}
      <button
        type="button"
        on:click={clearSearch}
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    {/if}
  </div>
</div>