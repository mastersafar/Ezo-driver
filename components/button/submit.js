'use client';
import { useFormStatus } from 'react-dom'


export default function Submit() {

    const { pending } = useFormStatus() ;

    return <button  disabled={pending}
    
    className="bg-sky-500 px-6 py-2 rounded">  
     {pending ? 'Adding...' : 'Add'}
    </button> ;
}