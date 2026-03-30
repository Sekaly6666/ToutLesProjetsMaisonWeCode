<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Afficher tous les utilisateurs (index)
    public function index()
    {
        $users = User::all();
        return view('users.index', compact('users'));
    }

    // Afficher formulaire de création
    public function create()
    {
        return view('users.create');
    }

    // Enregistrer nouvel utilisateur
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phoneNumber' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:user,admin',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phoneNumber' => $validated['phoneNumber'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.index')->with('success', 'Utilisateur créé !');
    }

    // Afficher un utilisateur
    public function show(User $user)
    {
        return view('users.show', compact('user'));
    }

    // Formulaire édition
    public function edit(User $user)
    {
        return view('users.edit', compact('user'));
    }

    // Mettre à jour
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phoneNumber' => 'required|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|string|in:user,admin',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phoneNumber' => $validated['phoneNumber'],
            'role' => $validated['role'],
            'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
        ]);

        return redirect()->route('users.index')->with('success', 'Utilisateur mis à jour !');
    }

    // Supprimer un utilisateur
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'Utilisateur supprimé !');
    }
}
