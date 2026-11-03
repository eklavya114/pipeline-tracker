'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { COPY } from '@/lib/copy'

export function Nav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: COPY.nav.dashboard },
    { href: '/companies', label: COPY.nav.companies },
    { href: '/applications', label: COPY.nav.applications },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-6">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                pathname === link.href
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
