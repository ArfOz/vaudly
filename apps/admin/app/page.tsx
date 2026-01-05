import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-200 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mt-0">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-700">Welcome!</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          Manage your activities easily from the navigation above.
        </p>
        <Link
          href="/activities"
          className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow transition"
        >
          Go to Activities
        </Link>
      </div>
    </div>
  )
}
