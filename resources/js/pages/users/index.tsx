import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Button } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ReactEventHandler, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Users() {

    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');


    const fetchUsers = async () => {
        try {
            const result = await axios.get('/getUsers');
            console.log(result);
            setUsers(result.data.users);

        } catch (error: any) {
            if (error.isAxiosError) {
                setError(error.response.data.message);
            }

        }

    }

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) || search === '') 
        &&  (departmentFilter === '' || user.department === departmentFilter) 
        &&  (positionFilter === '' || user.position === positionFilter) 
      );

    const deleteUser = async (id: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) {
            return;
        }
        try {
            const result = await axios.delete(`/deleteUser/${id}`)
            console.log(result.data)
            setUsers((prev => prev.filter(user => user.id !== id)))
        } catch (error) {
            console.log(error)
        }
    }

    const convertToCsv = async() => {
        try {
            const response = await axios.post('/convertToCsv', {
                users: filteredUsers
            }, { responseType: 'blob' }); 
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.log(error);
        }
        
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            {error ?
                <h1> {error} </h1> :
                <>
                
                <div className='max-w-lg flex justify-between m-2'>
                    <input type='text' placeholder="Search by name or email..." value={search} 
                onChange={(e) => setSearch(e.target.value)}
                />
                    <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                        <option value="">All Departments</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                    </select>

                    <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
                        <option value="">All Positions</option>
                        <option value="Manager">Manager</option>
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                    </select>

                    </div>




                <div className='flex flex-col justify-center'>
                    
                    
                    <h1 className='text-xl font-bold mx-auto m-4'>Employees</h1>


                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        id
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Position
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Department
                                    </th>

                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {user.id}
                                        </th>
                                        <td className="px-6 py-4">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.position ? user.position : 'unknown'}
                                        </td>

                                        <td className="px-6 py-4">
                                        {user.department ? user.department : 'unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={route('user.edit', user.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">edit</a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={()=> deleteUser(user.id)}>
                                            <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">delete</a>
                                            </button>
                                            
                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                    </div>
                </div>

                


                <div className='flex justify-end'>
                    <button type='button' onClick={convertToCsv} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>export</button>
                    </div>
                </>
            }



        </AppLayout>
    );
}
