import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'edit',
        href: '/edit',
    },
];

interface UserProps {
    user: User;
}

type editForm = {
    name: string
    email: string;
    role: string;
    position: string;
    department: string;
};



export default function Edit({ user }: UserProps) {

    const { data, setData, patch, errors} = useForm<Required<editForm>>({
        name: user.name,
        email: user.email,
        role: 'user',
        position: user.position ?? '',
        department: user.department ?? '',
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        patch(route('user.update', user.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="edit" />

            <form onSubmit={submit}>
                
                <div className='max-w-md flex flex-col gap-2 p-2 mt-5 mx-auto shadow-md rounded-lg'>
                <h1 className='font-bold text-lg mx-auto'>Edit User</h1>
                <Label htmlFor="name">Name</Label>
                    <input type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="name" />

                    <p className='text-red-500'>{errors.name}</p>

                    <Label htmlFor="email">Email</Label>
                    <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="email@example.com" />
                    <p className='text-red-500'>{errors.email}</p>

                    <Label htmlFor="Position">Position</Label>
                    <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        type="text"
                        value={data.position}
                        onChange={(e) => setData('position', e.target.value)}
                        placeholder="position: manager..." />
                    <p className='text-red-500'>{errors.position}</p>

                    <Label htmlFor="Department">Department</Label>
                    <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        type="text"
                        value={data.department}
                        onChange={(e) => setData('department', e.target.value)}
                        placeholder="department" />
                    <p className='text-red-500'>{errors.department}</p>
                    
                    <Label htmlFor="role">Change Role</Label>
                    <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' name="role" value={data.role} onChange={(e) => setData('role', e.target.value)}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                    </select>
                    <p className='text-red-500'>{errors.role}</p>
                    
                    <div className='flex justify-center'>
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>submit</button>
                    </div>
                    
                </div>
                
            </form>




        </AppLayout>
    );
}
