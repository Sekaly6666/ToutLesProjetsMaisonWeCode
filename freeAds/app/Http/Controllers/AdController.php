<?php
// Tâche faite par Sekou Amara Bamba 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ad;
use Illuminate\Support\Facades\Auth;

class AdController extends Controller
{
    //

      public function index()
    {
        $ads = Ad::latest()->get();
        return view('ads.index', compact('ads'));
    }

    public function create()
    {
        return view('ads.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'=>'required',
            'category'=>'required',
            'description'=>'required',
            'photo'=>'required|image',
            'price'=>'required',
            'location'=>'required'
        ]);

        $image = $request->file('photo')->store('ads','public');

        Ad::create([
            'title'=>$request->title,
            'category'=>$request->category,
            'description'=>$request->description,
            'photo'=>$image,
            'price'=>$request->price,
            'location'=>$request->location,
            'user_id'=>Auth::id()
        ]);

        return redirect('/');
    }

    public function show($id)
    {
        $ad = Ad::findOrFail($id);
        return view('ads.show', compact('ad'));
    }

    public function edit($id)
    {
        $ad = Ad::findOrFail($id);
        return view('ads.edit', compact('ad'));
    }

    public function update(Request $request, $id)
    {
        $ad = Ad::findOrFail($id);

        $ad->update($request->all());

        return redirect('/');
    }

    public function destroy($id)
    {
        $ad = Ad::findOrFail($id);
        $ad->delete();

        return redirect('/');
    }
}
