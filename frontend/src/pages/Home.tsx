export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to E-Commerce</h1>
      <p className="text-xl text-gray-600 mb-8">Digital products for everyone</p>
      <a
        href="/products"
        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
      >
        Browse Products
      </a>
    </div>
  )
}
