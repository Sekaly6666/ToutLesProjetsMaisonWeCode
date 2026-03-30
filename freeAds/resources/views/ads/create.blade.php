<!-- Tâche faite par Sekou Amara Bamba -->
<h1>Créer une annonce</h1>

<form action="/ads" method="POST" enctype="multipart/form-data">
    @csrf

    <input type="text" name="title" placeholder="Titre" required>

    <!-- Menu déroulant pour la catégorie -->
    <select name="category" required>
        <option value="" disabled selected>Choisissez une catégorie</option>
        <!-- Immobilier -->
        <optgroup label="Immobilier">
            <option value="Appartement">Appartement</option>
            <option value="Maison">Maison</option>
            <option value="Terrain">Terrain</option>
            <option value="Location saisonnière">Location saisonnière</option>
        </optgroup>

        <!-- Véhicules -->
        <optgroup label="Véhicules">
            <option value="Voiture">Voiture</option>
            <option value="Moto">Moto</option>
            <option value="Vélo">Vélo</option>
            <option value="Camion">Camion</option>
        </optgroup>

        <!-- Électronique / High-Tech -->
        <optgroup label="Électronique / High-Tech">
            <option value="Smartphones">Smartphones</option>
            <option value="Ordinateurs / Tablettes">Ordinateurs / Tablettes</option>
            <option value="TV / Audio">TV / Audio</option>
            <option value="Accessoires">Accessoires</option>
        </optgroup>

        <!-- Mode / Accessoires -->
        <optgroup label="Mode / Accessoires">
            <option value="Vêtements">Vêtements</option>
            <option value="Chaussures">Chaussures</option>
            <option value="Sacs / Bijoux">Sacs / Bijoux</option>
        </optgroup>

        <!-- Loisirs / Sports / Jeux -->
        <optgroup label="Loisirs / Sports / Jeux">
            <option value="Livres">Livres</option>
            <option value="Jeux vidéo">Jeux vidéo</option>
            <option value="Instruments de musique">Instruments de musique</option>
            <option value="Équipements sportifs">Équipements sportifs</option>
        </optgroup>

        <!-- Services -->
        <optgroup label="Services">
            <option value="Cours / Formations">Cours / Formations</option>
            <option value="Réparation / Bricolage">Réparation / Bricolage</option>
            <option value="Événementiel">Événementiel</option>
            <option value="Transport / Déménagement">Transport / Déménagement</option>
        </optgroup>

    </select>

    <textarea name="description" placeholder="Description" required></textarea>

    <input type="file" name="photo" required>

    <input type="number" name="price" placeholder="Prix" required>

    <input type="text" name="location" placeholder="Lieu" required>

    <button type="submit">Publier</button>
</form>