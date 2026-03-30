<h1>User</h1>

<p>Name: {{ $user->name }}</p>
<p>Email: {{ $user->email }}</p>
<p>Phone: {{ $user->phoneNumber }}</p>
<p>Role: {{ $user->role }}</p>

<a href="{{ route('users.index') }}">Back</a>
