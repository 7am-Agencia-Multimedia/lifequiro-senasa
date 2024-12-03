'use client'
import Login from '@/components/login/Login';

export default function Home() {

  return (
    <main className='flex justify-center items-center h-screen'>
      <div className='flex flex-col justify-center items-center w-full'>
        <Login />
        <p className=' absolute bottom-5 text-xs text-neutral-300'>©2024 TODOS LOS DERECHOS RESERVADOS</p>
      </div>
    </main>
  )

}
