function BottomWave({
  fromColor,
  toColor,
  flip = false,
}: {
  fromColor?: string
  toColor: string
  flip?: boolean
}) {
  return (
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      style={{ backgroundColor: fromColor }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: 72, display: "block" }}
      >
        <path
          d={
            flip
              ? "M0,32 C240,0 480,64 720,32 C960,0 1200,64 1440,32 L1440,72 L0,72 Z"
              : "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,72 L0,72 Z"
          }
          fill={toColor}
        />
      </svg>
    </div>
  )
}

export { BottomWave }
