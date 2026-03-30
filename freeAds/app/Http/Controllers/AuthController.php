<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller

{
    /**
     * Display a listing of the resource.
     */
    public function showLogin()
    {
        return view('auth.login');
    }

     public function showRegister()
    {
        return view('auth.register');
    }

    public function register(Request $request){

    $validatedData = $request->validate([
        'login'       => 'required|string|max:255|unique:users',
        'email'       => 'required|string|email|max:255|unique:users',
        'password'    => 'required|string|min:8|confirmed',
        'phonenumber' => 'required|string|max:20',
    ]);

    $user = User::create([
        'login'       => $validatedData['login'],
        'email'       => $validatedData['email'],
        'password'    => Hash::make($validatedData['password']),
        'phoneNumber' => $validatedData['phonenumber'],
        'role'        => 'user',
    ]);

    $user->sendEmailVerificationNotification(); // ←waaaa voici la seule ligne à ajouter pour envoyer le mail de vérification c'est plus facile mais je dois revenir sur la logique

    Auth::login($user);
    return redirect()->route('verification.notice');
}


    public function login(Request $request)
{
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'Les informations d\'identification sont incorrectes.',
        ])->onlyInput('email');
    }


    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
