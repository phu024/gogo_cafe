import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบหน้าเว็บ</h2>
        <p className="text-gray-600 mb-8">ขออภัย หน้าเว็บที่คุณค้นหาไม่มีอยู่</p>
        <Link 
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  )
}
