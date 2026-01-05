import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow mb-0 py-3 px-4 flex items-center gap-6 z-50 relative">
      <Link
        href="/"
        className="text-blue-600 hover:underline font-semibold text-lg"
      >
        Home
      </Link>
      <Link
        href="/activities"
        className="text-blue-600 hover:underline font-semibold text-lg"
      >
        Activities
      </Link>
      <Link
        href="/activities/add"
        className="text-blue-600 hover:underline font-semibold text-lg"
      >
        Add Activity
      </Link>
    </nav>
  )
}
