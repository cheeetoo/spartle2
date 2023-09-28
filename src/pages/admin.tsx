import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@vercel/kv';
// import { client } from '@/lib/kv_client';

export default function Admin() {
  const router = useRouter();
  const [word, setWord] = useState('');

  const client = createClient({
    url: process.env.NEXT_PUBLIC_KV_REST_API_URL ?? '',
    token: process.env.NEXT_PUBLIC_KV_REST_API_TOKEN ?? '',
  }); // TODO: unsafe af, fix

  useEffect(() => {
    const password = prompt('Please enter the admin password:');

    if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWD) {
      alert('Incorrect password');
      router.push('/');
    }
  }, []);

    const updateWord = async (word: string) => {
        console.log(word);
        await client.set('word', word);
    }

  return (
    <div className='flex'>
      <h1 className='text-white m-2'>Change word</h1>
      <input type="text" value={word} onChange={(e) => setWord(e.target.value)} className='m-2'/>
      <button onClick={async () => {await updateWord(word)}} className='bg-white border border-gray-500 m-2'>Submit</button>
    </div>
  );
}
