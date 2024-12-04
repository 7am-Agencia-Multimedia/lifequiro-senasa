'use client'
import { useState, useEffect } from 'react';
import Login from '@/components/login/Login';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsLoading(false);  
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex justify-center items-center h-screen">
      {isLoading ? (
        <div className="spinner">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full">
          <Login />
          <p className="absolute bottom-5 text-xs text-neutral-300">©2024 TODOS LOS DERECHOS RESERVADOS</p>
        </div>
      )}
    </main>
  );
}
