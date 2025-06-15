<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let title: string;
  export let message: string;

  const dispatch = createEventDispatcher();

  function handleConfirm() {
    dispatch('confirm');
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
  <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl animate-bounce-in">
    <div class="text-center mb-6">
      <div class="text-4xl mb-3">⚠️</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p class="text-gray-600">{message}</p>
    </div>
    
    <div class="flex gap-3">
      <button 
        class="btn-secondary flex-1"
        on:click={handleCancel}
      >
        Cancel
      </button>
      <button 
        class="btn-danger flex-1"
        on:click={handleConfirm}
      >
        Delete
      </button>
    </div>
  </div>
</div>