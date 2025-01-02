import Link from 'next/link'
import CreateCoin from '@/components/create-coin'

export default function Create() {
  return (
    <div className='block w-full items-center justify-center text-center'>
      <Link href='/' className='text-2xl hover:font-semibold'>
        [go back]
      </Link>
      <CreateCoin />
    </div>
  )
}
