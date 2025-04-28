import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18]  lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4 ">
                        <div className="dark:text-white">
                            <AppearanceToggleDropdown />
                        </div>  
                        
                        
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
               
                <main className="flex flex-col items-center justify-center flex-1 bg-[#FDFDFC] px-6 py-12 text-center dark:bg-[#0a0a0a]">
                <div className="max-w-md space-y-6">
                    <h1 className="text-4xl font-semibold text-[#1b1b18] dark:text-white">
                        Welcome{auth.user ? `, ${auth.user.name}` : ''} 👋
                    </h1>

                    <p className="text-md text-[#3e3e3a] dark:text-neutral-400">
                        This is your user management system. From here, you can manage users, check activity, and more.
                    </p>

                    {auth.user ?  <>
                        <div className="text-sm text-[#555] dark:text-neutral-400">
                            You are logged in as: <span className="font-medium">{auth.user.role}</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Button asChild >
                            <a href="/dashboard">Go to Dashboard</a>
                        </Button>
                        {auth.user?.role === 'admin' && (
                            <Button variant='outline'>
                                <a href="/users">Manage Users</a>
                            </Button>
                        )}
                    </div>
</> : <>You are not currently logged in! <div className='flex gap-2 justify-center m-2'>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </div>
                            </>

                    }

                    
                </div>
            </main>
                
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
