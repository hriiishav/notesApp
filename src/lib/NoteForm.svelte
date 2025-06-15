<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let loading = false;

  const dispatch = createEventDispatcher();

  let title = '';
  let content = '';

  function handleSubmit() {
    if (!title.trim() && !content.trim()) return;
    
    dispatch('submit', {
      title: title.trim(),
      content: content.trim(),
    });
    
    // Reset form
    title = '';
    content = '';
  }

  function handleCancel() {
    title = '';
    content = '';
    dispatch('cancel');
  }
</script>

<div class="card p-6">
  <h2 class="text-2xl font-semibold text-gray-800 mb-6">Create New Note</h2>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
        Title
      </label>
      <input
        id="title"
        type="text"
        bind:value={title}
        placeholder="Enter note title..."
        class="input-field"
        disabled={loading}
      />
    </div>
    
    <div>
      <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
        Content
      </label>
      <textarea
        id="content"
        bind:value={content}
        placeholder="Write your note here..."
        rows="6"
        class="input-field resize-none"
        disabled={loading}
      ></textarea>
    </div>
    
    <div class="flex gap-3 pt-4">
      <button 
        type="submit"
        class="btn-primary flex-1"
        disabled={loading || (!title.trim() && !content.trim())}
      >
        {loading ? 'Creating...' : 'Create Note'}
      </button>
      <button 
        type="button"
        class="btn-secondary flex-1"
        on:click={handleCancel}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  </form>
</div>