Project Description:

This project is role-based user management system designed to provide administrators with control over user accounts 
while maintaining restrictions for standard users.

Features:
User registration and login system using starter pack for auth.
Role-based access control:
  - Standard users can create accounts and update personal information.
  - Admins can view, edit, delete, and assign roles to users.
Management of additional user details such as department and position.
Middleware-based security for admin-specific actions.
Filtered search by name/email, department and position
Download csv file(regular and if search was filtered)
Error handling for restricted actions and invalid inputs.
Error + success messages.

Tech Stack:
Frontend: React(TypeScript), Tailwind.
Backend: Laravel framework + Inertia.js.

How to install:

- git clone https://github.com/exeeny/user_management.git
- cd repository-name
- cp .env.example .env
- composer install
- php artisan key:generate
- php artisan migrate (click yes to make db file)

important! 
by default user is registered with a role of standart user, so you need to seed admin first to experience it's features. in user seeder i provided usefull info(u can also edit it for personal use) after that
- php artisan db:seed --class=UserSeeder

now u have admin!

also!

i edit main user factory so u can seed db with fake users unfo (with department and position)
- php artisan db:seed

next:

- npm install
- npm run build

done
