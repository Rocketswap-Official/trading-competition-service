import { writable } from 'svelte/store'
import type { I_Competition } from './types/types';

export const competitions_store = writable(writable<I_Competition[]>);

