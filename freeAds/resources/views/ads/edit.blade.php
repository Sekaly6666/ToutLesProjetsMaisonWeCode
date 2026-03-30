<!-- Tâche faite par Sekou Amara Bamba -->
<h1>Modifier l'annonce</h1>

<form action="/ads/{{ $ad->id }}" method="POST" enctype="multipart/form-data">
    @csrf
    @method('PUT')

    <input type="text" name="title" placeholder="Titre" value="{{ $ad->title }}">

    <input type="text" name="category" placeholder="Catégorie" value="{{ $ad->category }}">

    <textarea name="description">{{ $ad->description }}</textarea>

    <input type="file" name="photo">

    <input type="number" name="price" placeholder="Prix" value="{{ $ad->price }}">

    <input type="text" name="location" placeholder="Lieu" value="{{ $ad->location }}">

    <button type="submit">Enregistrer</button>
</form>
