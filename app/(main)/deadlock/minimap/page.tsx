import Image from 'next/image'
import mapImage from '@/app/map.png'

export default function MinimapPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Minimap
        </h1>
        <div className="w-full max-w-5xl border rounded-lg p-4 bg-gray-900/50 flex justify-center shadow-lg">
          <Image 
            src={mapImage} 
            alt="Deadlock Minimap"
            className="rounded-lg object-contain w-full h-auto"
            priority
          />
        </div>
      </main>
    </div>
  )
}
