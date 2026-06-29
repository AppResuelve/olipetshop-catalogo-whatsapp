// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PawIcon } from "@/components/ui/PawIcon";
import { servicesService } from "@/services/storeService";
import { formatPrice } from "@/utils/formatPrice";
import { content } from "@/data/siteData";
import { BottomWave } from "@/components/ui/BottomWave";

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

function ServiceCard({ service }) {
  const variants = service.variants || [];
  const minPrice =
    variants.length > 0
      ? Math.min(...variants.map((v) => Number(v.price)))
      : Number(service.price) || 0;
  const hasDuration = variants.some((v) => v.durationMinutes);

  return (
    <Link
      href={`/servicios/${service.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-card)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 12px 40px rgba(203,110,228,0.12)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {service.images && service.images[0] && (
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={service.images[0]}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex-1 p-5 flex flex-col">
        <h3
          className="text-lg font-normal mb-2 group-hover:text-[var(--color-primary)] transition-colors"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text-primary)",
          }}
        >
          {service.name}
        </h3>
        {service.description && (
          <p
            className="text-sm line-clamp-2 mb-4 flex-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {service.description}
          </p>
        )}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              {formatPrice(minPrice)}
            </span>
            {variants.length > 1 && (
              <span
                className="text-xs ml-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                desde
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasDuration && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                <Clock className="w-3 h-3" />
                {Math.min(
                  ...variants
                    .filter((v) => v.durationMinutes)
                    .map((v) => v.durationMinutes),
                )}{" "}
                min
              </span>
            )}
            <span
              className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
              style={{ color: "var(--color-primary)" }}
            >
              Ver <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesService
      .list({ limit: 100 })
      .then((r) => setServices(r.services))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#fefce8",
          paddingTop: "3.5rem",
          paddingBottom: "5.5rem",
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
          style={{ opacity: 0.35, transform: "rotate(-12deg)" }}
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
  );
}
