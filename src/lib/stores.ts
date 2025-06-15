import { writable } from 'svelte/store';
import type { Note } from './types';

export const notesStore = writable<Note[]>([]);