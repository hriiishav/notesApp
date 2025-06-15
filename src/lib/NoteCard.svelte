<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Note } from './types';

  export let note: Note;
  export let editing = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  let title = note.title;
  let content = note.content;

  function handleEdit() {
    if (disabled) return;
    title = note.title;
    content = note.content;
    dispatch('edit');
  }

  function handleSave() {
    if (disabled || (!title.trim() && !content.trim())) return;
    dispatch('save', { title: title.trim(), content: content.trim() });
  }

  function handleCancel() {
    if (disabled) return;
    title = note.title;
    content = note.content;
    dispatch('cancel');
  }

  function handleDelete() {
    if (disabled) return;
    dispatch('delete');
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="card p-6 h-full flex flex-col">
  {#if editing}
    <!-- Edit Mode -->
    <div class="flex-1 space-y-4">
      <input
        type="text"
        bind:value={title}
        placeholder="Note title..."
        class="input-field font-semibold text-lg"
        disabled={disabled}
      />
      
      <textarea
        bind:value={content}
        placeholder="Write your note here..."
        rows="6"
        class="input-field resize-none flex-1"
        disabled={disabled}
      ></textarea>
    </div>
    
    <div class="flex gap-2 mt-4">
      <button 
        class="btn-primary flex-1"
        on:click={handleSave}
        disabled={disabled || (!title.trim() && !content.trim())}
      >
        Save
      </button>
      <button 
        class="btn-secondary flex-1"
        on:click={handleCancel}
        disabled={disabled}
      >
        Cancel
      </button>
    </div>
  {:else}
    <!-- View Mode -->
    <div class="flex-1">
      <h3 class="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
        {note.title}
      </h3>
      
      <p class="text-gray-600 mb-4 line-clamp-4 leading-relaxed">
        {note.content}
      </p>
      
      <div class="text-sm text-gray-400 mb-4">
        {formatDate(note.createdAt)}
      </div>
    </div>
    
    <div class="flex gap-2 pt-4 border-t border-gray-100">
      <button 
        class="btn-secondary flex-1"
        on:click={handleEdit}
        disabled={disabled}
      >
        ✏️ Edit
      </button>
      <button 
        class="btn-danger flex-1"
        on:click={handleDelete}
        disabled={disabled}
      >
        🗑️ Delete
      </button>
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>