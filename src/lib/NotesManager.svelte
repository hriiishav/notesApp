<script lang="ts">
  import { onMount } from 'svelte';
  import NoteCard from './NoteCard.svelte';
  import NoteForm from './NoteForm.svelte';
  import SearchBar from './SearchBar.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import { notesStore } from './stores';
  import type { Note } from './types';

  let notes: Note[] = [];
  let filteredNotes: Note[] = [];
  let loading = false;
  let error = '';
  let searchQuery = '';
  let showForm = false;
  let editingNote: Note | null = null;
  let showConfirmDialog = false;
  let noteToDelete: Note | null = null;

  // Subscribe to notes store
  $: notes = $notesStore;
  $: filteredNotes = searchQuery 
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  onMount(async () => {
    await loadNotes();
  });

  async function loadNotes() {
    loading = true;
    error = '';
    
    try {
      const response = await fetch('https://684eb683f0c9c9848d28e317.mockapi.io/api/v1/notes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      
      const data = await response.json();
      notesStore.set(data);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load notes';
      console.error('Load notes error:', e);
    } finally {
      loading = false;
    }
  }

  async function handleCreateNote(event: CustomEvent) {
    const noteData = event.detail;
    loading = true;
    error = '';
    
    try {
      const response = await fetch('https://684eb683f0c9c9848d28e317.mockapi.io/api/v1/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noteData.title,
          content: noteData.content
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create note: ${response.status} ${errorText}`);
      }
      
      const newNote = await response.json();
      notesStore.update(notes => [newNote, ...notes]);
      showForm = false;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to create note';
      console.error('Create note error:', e);
    } finally {
      loading = false;
    }
  }

  async function handleUpdateNote(id: string, noteData: any) {
    loading = true;
    error = '';
    
    try {
      const response = await fetch(`https://684eb683f0c9c9848d28e317.mockapi.io/api/v1/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noteData.title,
          content: noteData.content
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update note: ${response.status} ${errorText}`);
      }
      
      const updatedNote = await response.json();
      notesStore.update(notes => 
        notes.map(note => note.id === id ? updatedNote : note)
      );
      editingNote = null;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to update note';
      console.error('Update note error:', e);
    } finally {
      loading = false;
    }
  }

  async function handleDeleteNote(id: string) {
    loading = true;
    error = '';
    
    try {
      const response = await fetch(`https://684eb683f0c9c9848d28e317.mockapi.io/api/v1/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete note: ${response.status} ${errorText}`);
      }
      
      notesStore.update(notes => notes.filter(note => note.id !== id));
      showConfirmDialog = false;
      noteToDelete = null;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to delete note';
      console.error('Delete note error:', e);
    } finally {
      loading = false;
    }
  }

  function handleDeleteClick(note: Note) {
    noteToDelete = note;
    showConfirmDialog = true;
  }

  function handleEditClick(note: Note) {
    editingNote = note;
  }

  function handleCancelEdit() {
    editingNote = null;
  }

  function handleSearch(event: CustomEvent) {
    searchQuery = event.detail;
  }
</script>

<div class="space-y-8">
  <!-- Header Actions -->
  <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
    <SearchBar on:search={handleSearch} />
    
    <button 
      class="btn-primary w-full sm:w-auto"
      on:click={() => showForm = !showForm}
      disabled={loading}
    >
      {showForm ? 'Cancel' : '+ Add New Note'}
    </button>
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
      <p class="font-medium">Error: {error}</p>
      <button 
        class="text-sm underline mt-1"
        on:click={loadNotes}
      >
        Try again
      </button>
    </div>
  {/if}

  <!-- Create Note Form -->
  {#if showForm}
    <div class="animate-slide-in">
      <NoteForm 
        on:submit={handleCreateNote}
        on:cancel={() => showForm = false}
        loading={loading}
      />
    </div>
  {/if}

  <!-- Loading State -->
  {#if loading && notes.length === 0}
    <div class="flex justify-center py-12">
      <LoadingSpinner />
    </div>
  {/if}

  <!-- Notes Grid -->
  {#if filteredNotes.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredNotes as note (note.id)}
        <div class="animate-bounce-in">
          <NoteCard 
            {note}
            editing={editingNote?.id === note.id}
            on:edit={() => handleEditClick(note)}
            on:delete={() => handleDeleteClick(note)}
            on:save={(e) => handleUpdateNote(note.id, e.detail)}
            on:cancel={handleCancelEdit}
            disabled={loading}
          />
        </div>
      {/each}
    </div>
  {:else if !loading && notes.length === 0}
    <div class="text-center py-12">
      <div class="text-6xl mb-4">📝</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No notes yet</h3>
      <p class="text-gray-500 mb-6">Create your first note to get started!</p>
      <button 
        class="btn-primary"
        on:click={() => showForm = true}
      >
        Create First Note
      </button>
    </div>
  {:else if filteredNotes.length === 0 && searchQuery}
    <div class="text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No notes found</h3>
      <p class="text-gray-500">Try adjusting your search query</p>
    </div>
  {/if}

  <!-- Confirmation Dialog -->
  {#if showConfirmDialog && noteToDelete}
    <ConfirmDialog
      title="Delete Note"
      message="Are you sure you want to delete '{noteToDelete.title}'? This action cannot be undone."
      on:confirm={() => handleDeleteNote(noteToDelete.id)}
      on:cancel={() => {
        showConfirmDialog = false;
        noteToDelete = null;
      }}
    />
  {/if}
</div>