import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User, type PaginationLink } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ReactEventHandler, use, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];


interface Props {
    users: {
        data: User[];
        links: PaginationLink[];
    };
    filters: {
        search?: string;
        department?: string;
        position?: string;
    };
}

export default function Users({ users, filters }: Props) {

    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [position, setPosition] = useState(filters.position || '');
    const [page, setPage] = useState(1);
    const {flash} = usePage().props as any;

    const fetchFiltered = () => {
        router.get('/users', {
            search,
            department,
            position,
            page
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchFiltered();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search, department, position, page]);

    useEffect(()=>{
        if(flash?.success){
            Swal.fire({
                title: "Success!",
                text: flash.success,
                icon: "success"
              });
              
        }

    }, [flash])

    const convertToCsv = async () => {
        try {
            const response = await axios.post('/convertToCsv', {
                search,
                department,
                position
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

    const deleteUser = async (id: number) => {
        if(confirm("Are you sure you want to delete this user?")){
            router.delete(route('users.destroy', id)), {
                replace: true,
                preserveScroll: true,
                preserveState: true,
            }
        }
        
    }







    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />


            <div className="max-w-lg flex justify-between gap-2 m-2">
                <input
                    className="border px-2 py-1 rounded w-full"
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border px-2 py-1 rounded"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option value="">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                </select>

                <select
                    className="border px-2 py-1 rounded"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                >
                    <option value="">All Positions</option>
                    <option value="Manager">Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                </select>
            </div>


            <h1 className="text-2xl font-bold mb-4">Employees</h1>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Position</th>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Edit</th>
                            <th className="px-6 py-3">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user: any) => (
                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{user.id}</td>
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.position ?? 'Unknown'}</td>
                                <td className="px-6 py-4">{user.department ?? 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    <Link href={route('user.edit', user.id)} className="text-blue-600 hover:underline">Edit</Link>
                                </td>
                                <td className="px-6 py-4">
                  <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="py-6">
                {users.links.map((link: any) =>
                    link.url ? (
                        <button
                            key={link.label}
                            onClick={() => {
                                // Extract page number from URL
                                const urlParams = new URLSearchParams(link.url.split('?')[1]);
                                const pageParam = urlParams.get('page');
                                setPage(Number(pageParam)); // update state instead of navigation
                            }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`mx-1 p-1 ${link.active ? 'text-blue-500 font-bold' : ''}`}
                        />
                    ) : (
                        <span
                            key={link.label}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className="mx-1 p-1 text-slate-300"
                        />
                    )
                )}
            </div>

            <div className='flex justify-end'>

                <Button
                onClick={convertToCsv}>
                Export CSV
            </Button>
            </div>

        </AppLayout>
    );
}
