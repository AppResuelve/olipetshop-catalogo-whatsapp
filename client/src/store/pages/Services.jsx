import { useState, useEffect } from 'react'
import { servicesService } from '../../services/storeService'
import { ServiceCard } from '../components/services/ServiceCard'
import { PawIcon } from '../components/ui/PawIcon'
import { content } from '../../data/siteData'

function ServiceSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-[var(--color-border)]" />
      <div className="p-5 space-y-2">
        <div className="h-4 bg-[var(--color-border)] rounded-full w-3/4" />
        <div className="h-3 bg-[var(--color-border)] rounded-full w-1/2" />
        <div className="h-5 bg-[var(--color-border)] rounded-full w-1/4 mt-4" />
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ServiceSkeleton key={i} />
      ))}
    </div>
  )
}

function BottomWave({ toColor }) {
  return (
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ height: 64, display: 'block', width: '100%' }}
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,72 L0,72 Z"
          fill={toColor}
        />
      </svg>
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const result = await servicesService.list({ limit: 100 })
        setServices(result.services)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: '#fefce8',
          paddingTop: '3.5rem',
          paddingBottom: '5.5rem',
        }}
      >
        <PawIcon
          size={144}
          className="absolute top-4 right-[7%] text-[var(--color-primary)] hidden md:block"
          style={{ opacity: 0.06 }}
        />
        <PawIcon
          size={96}
          className="absolute -bottom-2 left-[3%] text-[var(--color-secondary)] hidden md:block"
          style={{ opacity: 0.35, transform: 'rotate(-12deg)' }}
        />

        <div className="relative max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-3">
            {content.services.badge}
          </span>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05]
            text-[var(--color-text-primary)] mb-4 max-w-xl"
          >
            {content.services.title}
          </h1>
          {content.services.subtitle && (
            <p className="text-base text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
              {content.services.subtitle}
            </p>
          )}
          <div className="flex items-center gap-2 mt-5">
            <div className="h-1 w-12 rounded-full bg-[var(--color-secondary)]" />
            <div className="h-1 w-4 rounded-full bg-[var(--color-primary)]" />
          </div>
        </div>

        <BottomWave toColor="#ffffff" />
      </section>

      <section className="bg-white pb-20 px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <LoadingGrid />
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <PawIcon
                size={128}
                className="text-[var(--color-secondary)] mb-2"
                style={{ opacity: 0.4 }}
              />
              <p className="text-[var(--color-text-secondary)] text-sm">
                {content.services.noResults}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
