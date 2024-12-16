import Link from 'next/link'

export default function CreateCoinHeader() {
  return (
    <div className="w-full block content-center text-center py-10">
      <Link href="/create" className="hover:font-semibold text-2xl">
        [start a new coin]
      </Link>
    </div>
  )
}
