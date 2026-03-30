  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login_page</title>
</head>
<body>
        <h1>welcome to the login page</h1>
        <form method="POST" action="{{ route('login') }}">
    @csrf
         @if ($errors->any())
        <div>
            @foreach ($errors->all() as $error)
                <p style="color:red">{{ $error }}</p>
            @endforeach
        </div>
    @endif

    <input type="email" name="email" placeholder="Email" value="{{ old('email') }}">
    <input type="password" name="password" placeholder="Mot de passe">

    <!-- La case se souvenir de moi, laravel se charge tt seule de recuprer la valeur du champ remender puis stock en bd un cookie qui contient de quoi verifie l'identite du user a sa prochaine connexion!" -->
    <input type="checkbox" name="remember"> Se souvenir de moi

    <button type="submit">Se connecter</button>
</form>
</body>
</html>
