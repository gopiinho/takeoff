import Link from 'next/link'

export default function CreateCoinHeader() {
  return (
    <div className="block w-full content-center pb-10 text-center">
      <Link href="/create" className="text-2xl hover:font-semibold">
        [start a new coin]
      </Link>
    </div>
  )
}
