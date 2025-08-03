export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Server Working!</h1>
        <p className="text-gray-600 mb-4">
          Your Next.js application is running successfully.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Next step:</strong> Add your Supabase credentials to .env.local to enable database features.
          </p>
        </div>
        <a 
          href="/" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}