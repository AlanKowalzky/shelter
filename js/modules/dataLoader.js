export async function loadPets() {
  const response = await fetch('assets/pets.json');
  if (!response.ok) {
    throw new Error(`Failed to load pets.json: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
