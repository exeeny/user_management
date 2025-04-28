<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{

    public function index(Request $request) {

        $query = User::query();

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($department = $request->input('department')) {
            $query->where('department', $department);
        }

        if ($position = $request->input('position')) {
            $query->where('position', $position);
        }

        $users = $query->where('id', '!=', Auth::id())->orderBy('id', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => $request->only('search', 'department', 'position'),
        ]);

       
    }

    public function getUsers()
    {
        
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

    return to_route('users.index')->with('success', 'User info was updated successfully!');
   }


    public function deleteUser(User $user)
    {
        $user->delete();
        return to_route('users.index')->with('success', 'User was deleted successfully');
    }

    public function exportToCsv(Request $request)
    {
        $search = $request->input('search');
        $department = $request->input('department');
        $position = $request->input('position');
        
        $usersQuery = User::query();
    
        if ($search) {
            $usersQuery->where(function($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            });
        }
    
        if ($department) {
            $usersQuery->where('department', $department);
        }
    
        if ($position) {
            $usersQuery->where('position', $position);
        }

        $users = $usersQuery->get();

        if ($users->isEmpty()) {
            return response()->json(['error' => 'No users found based on the filters.'], 404);
        }

        $csvFileName = 'filtered_users.csv';
        $csvFilePath = storage_path('app/' . $csvFileName);

        $csvFile = fopen($csvFilePath, 'w');
    
        $headers = array_keys($users->first()->toArray()); 
    
        fputcsv($csvFile, $headers);

        foreach ($users as $user) {
            fputcsv($csvFile, $user->toArray());
        }

        fclose($csvFile);

        return response()->download($csvFilePath)->deleteFileAfterSend(true);
    }
}
