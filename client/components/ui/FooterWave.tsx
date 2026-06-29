function FooterWave({ fromColor = "#c70404" }: { fromColor?: string }) {
  return (
    <div
      className="w-full overflow-hidden leading-none"
      style={{ backgroundColor: fromColor }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 64"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full h-16"
      >
        <path
          d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,20 1440,32 L1440,64 L0,64 Z"
          fill="#1a1a1a"
        />
      </svg>
    </div>
  )
}

export { FooterWave }
