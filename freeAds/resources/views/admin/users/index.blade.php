<h1>Users</h1>

<a href="{{ route('users.create') }}">Create User</a>

<table border="1">
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Actions</th>
    </tr>

@foreach($users as $user)
<tr>
    <td>{{ $user->id }}</td>
    <td>{{ $user->name }}</td>
    <td>{{ $user->email }}</td>
    <td>{{ $user->phoneNumber }}</td>
    <td>{{ $user->role }}</td>

    <td>
        <a href="{{ route('users.show', $user) }}">View</a>

        <a href="{{ route('users.edit', $user) }}">Edit</a>

        <form action="{{ route('users.destroy', $user) }}" method="POST" style="display:inline;">
            @csrf
            @method('DELETE')
            <button type="submit">Delete</button>
        </form>
    </td>
</tr>
@endforeach

</table>
