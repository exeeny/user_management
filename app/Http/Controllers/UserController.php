<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{

    public function index() {
        return Inertia::render('users/index');
    }

    public function getUsers()
    {
        $users = User::where('id', '!=', Auth::id())->latest()->get();
        return response()->json(['users' => $users]);
    }

    public function edit(User $user){
        return Inertia::render('users/edit', ['user' => $user]);
    }

   public function update(Request $request, User $user)
   {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'role' => ['required', Rule::in(['admin', 'user'])],
        'position' => 'nullable|string|max:255',  
        'department' => 'nullable|string|max:255',
    ]);

    $user->update($validated);
    return Inertia::render('users/index');
   }


    public function deleteUser(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function exportToCsv(Request $request)
    {
        $users = $request->input('users');

        $csvFileName = 'user.csv';
        $csvFilePath = storage_path('app/' . $csvFileName);
        $csvFile = fopen($csvFilePath, 'w');

        $usersCollection = collect($users);

        $headers = array_keys($usersCollection->first());
    
        fputcsv($csvFile, $headers);
    
        foreach ($usersCollection as $user) {
            fputcsv($csvFile, $user);
        }
    
        fclose($csvFile);
    
        return response()->download($csvFilePath)->deleteFileAfterSend();
    }
}
