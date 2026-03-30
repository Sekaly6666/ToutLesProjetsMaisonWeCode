<!-- Tâche faite par Sekou Amara Bamba -->

<h1>Liste des annonces</h1>

@foreach($ads as $ad)

<div>

<h2>{{ $ad->title }}</h2>

<p>{{ $ad->price }} €</p>

<p>{{ $ad->location }}</p>

<a href="/ads/{{ $ad->id }}">Voir</a>

</div>

@endforeach