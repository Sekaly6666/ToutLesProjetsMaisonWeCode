<h1>Create User</h1>

<form action="{{ route('users.store') }}" method="POST">
@csrf

<input type="text" name="name" placeholder="Name">
<br>

<input type="email" name="email" placeholder="Email">
<br>

<input type="text" name="phoneNumber" placeholder="Phone number">
<br>

<select name="role">
<option value="user">User</option>
<option value="admin">Admin</option>
</select>
<br>

<input type="password" name="password" placeholder="Password">
<br>

<input type="password" name="password_confirmation" placeholder="Confirm Password">
<br>

<button type="submit">Create</button>

</form>
