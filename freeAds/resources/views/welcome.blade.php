<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }}</title>
    <style>
        
@tailwind base;
@tailwind components;
@tailwind utilities;

.header {
    background-color: #ffffff;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo a {
    font-weight: bold;
    font-size: 1.5rem;
    color: #1f2937; /* gris foncé */
    text-decoration: none;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nav-link {
    color: #1f2937;
    text-decoration: none;
    padding: 0.5rem 0.8rem;
    border-radius: 5px;
    transition: background-color 0.2s;
}

.nav-link:hover {
    background-color: #e5e7eb; /* gris clair au hover */
}

.admin-link {
    background-color: #3b82f6; /* bleu pour admin */
    color: white;
}

.admin-link:hover {
    background-color: #2563eb; /* bleu foncé hover */
}

.btn-logout {
    background-color: #ef4444; /* rouge */
    color: white;
    border: none;
    padding: 0.5rem 0.8rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-logout:hover {
    background-color: #b91c1c; /* rouge foncé hover */
}

.register-link {
    border: 1px solid #3b82f6;
    padding: 0.5rem 0.8rem;
    border-radius: 5px;
    color: #3b82f6;
    transition: all 0.2s;
}

.register-link:hover {
    background-color: #3b82f6;
    color: white;
}

/* .login-link {
    border: 1px solid #3b82f6;
    padding: 0.5rem 0.8rem;
    border-radius: 5px;
    color: #3b82f6;
    transition: all 0.2s;
} */

    </style>

    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('../../../../public/header.css') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />


</head>

<body>
    <header class="header">
    <nav class="nav-container">
        <!-- Logo ou titre -->
        <div class="logo">
            <a href="{{ url('/') }}">FreeAds</a>
        </div>

        <!-- Liens selon connexion -->
        <div class="nav-links">
            @auth
                <a href="{{ route('profil') }}" class="nav-link">Profil</a>

                @if(Auth::user()->isAdmin())
                    <a href="{{ url('/dashboard') }}" class="nav-link admin-link">Dashboard</a>
                @endif

                <form action="{{ route('logout') }}" method="POST" class="logout-form">
                    @csrf
                    <button type="submit" class="btn-logout">Logout</button>
                </form>
            @else
                <a href="{{ route('show.login') }}" class="nav-link">Login</a>
                <a href="{{ route('show.register') }}" class="nav-link register-link">Register</a>
            @endauth
        </div>
    </nav>
</header>
</body>

</html>
