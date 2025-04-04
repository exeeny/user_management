Project Description:

This project is role-based user management system designed to provide administrators with control over user accounts 
while maintaining restrictions for standard users.

Features:
User registration and login system.
Role-based access control:
  - Standard users can create accounts and update personal information.
  - Admins can view, edit, delete, and assign roles to users.
Management of additional user details such as department and position.
Middleware-based security for admin-specific actions.
Filtered search by name/email, department and position
Download csv file(regular and if search was filtered)
Error handling for restricted actions and invalid inputs.

Tech Stack:
Frontend: React (TypeScript), Tailwind.
Backend: Laravel framework.

How to install:

- git clone https://github.com/exeeny/user_management.git
- cd repository-name
- cp .env.example .env
- composer install
- php artisan key:generate
- php artisan migrate (click yes to make db file)

next:

- npm install
- npm run build

done
