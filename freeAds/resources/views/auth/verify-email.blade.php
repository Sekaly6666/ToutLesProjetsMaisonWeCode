<!DOCTYPE html>
<html>
<head>
    <title>Vérification Email</title>
</head>
<body>

    <h1>Vérifie ton email !</h1>

    <p>Nous vous avons envoyé un lien de vérification sur votre email.</p>
    <p>Clique sur le lien dans le mail pour activer ton compte.</p>

    <!-- Si le mail n'est pas arrivé -->
    @if (session('status') == 'verification-link-sent')
        <p style="color:green">Un nouveau lien a été envoyé !</p>
    @endif

    <!-- Renvoyer le mail -->
    <form method="POST" action="{{ route('verification.send') }}">
        @csrf
        <button type="submit">Renvoyer le mail</button>
    </form>

    <!-- Se déconnecter -->
    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit">Logout</button>
    </form>

</body>
</html>
