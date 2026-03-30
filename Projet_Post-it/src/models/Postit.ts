// faite par sekou amara bamba
// Ce fichier définit les interfaces TypeScript (types de données) pour modéliser une note (Postit) ainsi que les structures des réponses venant de l'API.
export interface Postit {
  id: string; // ID mappé pour le frontend (Toucher par SEKOU AMARA BAMBA)
  _id?: string; // ID brut de l'API (Toucher par SEKOU AMARA BAMBA)
  title: string; // Titre du post-it (Toucher par SEKOU AMARA BAMBA)
  content: string[]; // Contenu (Format API) (Toucher par SEKOU AMARA BAMBA)
  date: string; // Date mappée pour le frontend (Toucher par SEKOU AMARA BAMBA)
  createdAt?: string; // Date brute de l'API (Toucher par SEKOU AMARA BAMBA)
}
// Toucher par SEKOU AMARA BAMBA

export interface PostitAPIResponse {
  notes: Postit[]; // Réponse type de l'API pour la liste
}

export interface PostitCreateUpdateResponse {
  "note_id": string; // Correction : pas d'espace à la fin du champ de l'API
}
// Toucher par SEKOU AMARA BAMBA
