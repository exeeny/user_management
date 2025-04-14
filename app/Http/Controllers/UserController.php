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

        $users = $query->orderBy('id', 'desc')->paginate(5)->withQueryString();

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
    return Inertia::render('users/index');
   }


    public function deleteUser(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function exportToCsv(Request $request)
    {
        $search = $request->input('search');
        $department = $request->input('department');
        $position = $request->input('position');
    
        // Query the users based on the filters
        $usersQuery = User::query();
    
        // Apply the search filter if present
        if ($search) {
            $usersQuery->where(function($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            });
        }
    
        // Apply the department filter if present
        if ($department) {
            $usersQuery->where('department', $department);
        }
    
        // Apply the position filter if present
        if ($position) {
            $usersQuery->where('position', $position);
        }
    
        // Get the filtered users
        $users = $usersQuery->get();

        if ($users->isEmpty()) {
            return response()->json(['error' => 'No users found based on the filters.'], 404);
        }
    
        // Define the CSV file name and path
        $csvFileName = 'filtered_users.csv';
        $csvFilePath = storage_path('app/' . $csvFileName);
    
        // Open the CSV file for writing
        $csvFile = fopen($csvFilePath, 'w');
    
        // Get the headers (keys of the first user)
        $headers = array_keys($users->first()->toArray()); // Convert to array to get keys
    
        // Write the header row to the CSV file
        fputcsv($csvFile, $headers);
    
        // Write each user's data to the CSV file
        foreach ($users as $user) {
            fputcsv($csvFile, $user->toArray()); // Convert each user to array
        }
    
        // Close the file after writing
        fclose($csvFile);
    
        // Return the CSV file as a downloadable response
        return response()->download($csvFilePath)->deleteFileAfterSend(true);
    }
}
