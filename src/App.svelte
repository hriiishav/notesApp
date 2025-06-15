<script lang="ts">
  import NotesManager from './lib/NotesManager.svelte';
</script>

<main class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
          📝 Notes Manager
        </h1>
        <p class="text-gray-600 text-lg md:text-xl animate-slide-in">
          Create, edit, and organize your thoughts with ease
        </p>
      </header>
      
      <NotesManager />
    </div>
  </div>
</main>