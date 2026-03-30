  <form action="{{ route('register') }}" method="POST">
    @csrf

    <h2>Register for an Account</h2>

    <!-- Afficher les erreurs -->
    @if ($errors->any())
        <div>
            @foreach ($errors->all() as $error)
                <p style="color:red">{{ $error }}</p>
            @endforeach
        </div>
    @endif

    <label for="login">Login:</label>
    <input type="text" name="login" value="{{ old('login') }}" required>

    <label for="email">Email:</label>
    <input type="email" name="email" value="{{ old('email') }}" required>

    <label for="phonenumber">Téléphone:</label>
    <input type="text" name="phonenumber" value="{{ old('phonenumber') }}" required>

    <label for="password">Password:</label>
    <input type="password" name="password" required>

    <label for="password_confirmation">Confirmer Password:</label>
    <input type="password" name="password_confirmation" required>

    <button type="submit">Register</button>
</form>
