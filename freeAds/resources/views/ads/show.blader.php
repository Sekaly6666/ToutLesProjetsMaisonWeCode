<!-- Tâche faite par Sekou Amara Bamba -->

<h1>{{ $ad->title }}</h1>

<p>{{ $ad->price }} €</p>

<p>{{ $ad->location }}</p>

<p>{{ $ad->description }}</p>

<img src="{{ $ad->photo }}" alt="{{ $ad->title }}">

<a href="/ads/{{ $ad->id }}/edit">Modifier</a>

<form action="/ads/{{ $ad->id }}" method="POST" style="display: inline;">
    @csrf
    @method('DELETE')
    <button type="submit">Supprimer</button>
</form>
