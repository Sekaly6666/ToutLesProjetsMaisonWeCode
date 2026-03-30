<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// Tâche faite par Sekou Amara Bamba 
use App\Http\Controllers\AdController;

// Page d'accueil - tout le monde peut voir
Route::get('/', function () {
    return view('welcome');
});

// Seulement pour les NON connectés
// Si t'es déjà connecté → redirigé ailleurs automatiquement
Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'showRegister'])->name('show.register');
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::get('/login', [AuthController::class, 'showLogin'])->name('show.login');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

// Seulement pour les connectés (peu importe si vérifié ou pas)
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Page qui dit "vérifie ton email"
    // Laravel redirige ici automatiquement si email pas vérifié
    Route::get('/email/verify', function () {
        return view('auth.verify-email');
    })->name('verification.notice');

    // Lien cliqué depuis le mailj
    // 'signed' = Laravel vérifie que le lien n'a pas été modifié
    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill(); // marque email_verified_at en DB
        Auth::logout();
        return redirect('/login'); //zoul dit de faire attention  au man in the middle , en gros max de securite pour ne pas laisser une interception reussir si facilement.
    })->middleware('signed')->name('verification.verify');

    // Bouton "renvoyer le mail"
    // 'throttle:6,1' = maximum 6 fois par minute (anti-spam)
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return back()->with('status', 'Lien envoyé !');
    })->middleware('throttle:6,1')->name('verification.send');
});

// Seulement pour les connectés ET email vérifié
// 'auth'     = doit être connecté
// 'verified' = doit avoir cliqué le lien de vérification
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profil', function () {
        return view('profil');
    })->name('profil');

    // Toutes lmes futures pages protégées vont ici
    // ex: dashboard, commandes, paramètres...
});


//decouverte de waoo on ecris  plusieurs route en une fois

Route::middleware(['auth','verified','admin'])->prefix('admin')->group(function () {

    Route::resource('users', UserController::class);

});


// Tâche faite par Sekou Amara Bamba 
Route::get('/', [AdController::class,'index']);

Route::get('/ads/create',[AdController::class,'create'])->middleware('auth');

Route::post('/ads',[AdController::class,'store']);

Route::get('/ads/{id}',[AdController::class,'show']);

Route::get('/ads/{id}/edit',[AdController::class,'edit'])->middleware('auth');

Route::put('/ads/{id}',[AdController::class,'update']);

Route::delete('/ads/{id}',[AdController::class,'destroy']);