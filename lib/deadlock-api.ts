// A placeholder for the Deadlock API client.

export interface Item {
  id: string;
  name: string;
  description: string;
}

export interface Build {
  id: string;
  name: string;
  description: string;
}

export interface Hero {
  id: string;
  name: string;
  description: string;
}

export async function getItems(): Promise<Item[]> {
  // For now, return a hardcoded list of items.
  // TODO: Replace this with actual API calls.
  return [
    { id: '1', name: 'Item 1', description: 'This is the first item.' },
    { id: '2', name: 'Item 2', description: 'This is the second item.' },
    { id: '3', name: 'Item 3', description: 'This is the third item.' },
  ];
}

export async function getBuilds(): Promise<Build[]> {
  // For now, return a hardcoded list of builds.
  // TODO: Replace this with actual API calls.
  return [
    { id: '1', name: 'Build 1', description: 'This is the first build.' },
    { id: '2', name: 'Build 2', description: 'This is the second build.' },
    { id: '3', name: 'Build 3', description: 'This is the third build.' },
  ];
}

export async function getHeroes(): Promise<Hero[]> {
  // For now, return a hardcoded list of heroes.
  // TODO: Replace this with actual API calls.
  return [
    { id: '1', name: 'Hero 1', description: 'This is the first hero.' },
    { id: '2', name: 'Hero 2', description: 'This is the second hero.' },
    { id: '3', name: 'Hero 3', description: 'This is the third hero.' },
  ];
}

