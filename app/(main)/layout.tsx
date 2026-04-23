'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import SignOutButton from '@/app/components/SignOutButton'

const links = [
  { href: '/deadlock/items', label: 'Items' },
  { href: '/deadlock/builds', label: 'Builds' },
  { href: '/deadlock/heroes', label: 'Heroes' },
  { href: '/deadlock/minimap', label: 'Minimap' },
  { href: '/deadlock/ai-summary', label: 'AI Summary' },
  { href: '/profile', label: 'Profile' },
]

export default function DeadlockLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen sticky top-0">
        <div className="p-4">
          <Link href="/">
            <h2 className="text-2xl font-bold hover:text-gray-300 transition-colors">Deadlock App</h2>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <motion.div
                    className={`p-4 hover:bg-gray-700 ${
                      pathname === link.href ? 'bg-gray-700' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.label}
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 mt-auto border-t border-gray-700">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 min-w-0">{children}</main>
    </div>
  )
}
