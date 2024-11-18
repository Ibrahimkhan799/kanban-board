export const NotFoundIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      {/* Main Container */}
      <rect
        x="100"
        y="60"
        width="200"
        height="180"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        className="opacity-20"
      />

      {/* Content Layout */}
      <g className="opacity-30">
        {/* Header Bar */}
        <rect
          x="120"
          y="80"
          width="160"
          height="20"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* Content Boxes */}
        <rect
          x="120"
          y="110"
          width="70"
          height="40"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="210"
          y="110"
          width="70"
          height="40"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* Bottom Lines */}
        <line
          x1="120"
          y1="200"
          x2="180"
          y2="200"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1="210"
          y1="200"
          x2="280"
          y2="200"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </g>

      {/* Main Search Group */}
      <g className="opacity-90">
        {/* Search Circle */}
        <circle
          cx="200"
          cy="150"
          r="25"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* 404 Text */}
        <text
          x="188"
          y="157"
          className="fill-current"
          style={{
            fontSize: "16px",
            fontFamily: "ui-monospace, monospace",
            letterSpacing: "0.5px",
            fontWeight: "400"
          }}
        >
          404
        </text>

        {/* Search Handle */}
        <line
          x1="218"
          y1="168"
          x2="230"
          y2="180"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Decorative Dots */}
      <g className="opacity-20">
        <circle cx="140" cy="220" r="1" fill="currentColor" />
        <circle cx="146" cy="220" r="1" fill="currentColor" />
        <circle cx="152" cy="220" r="1" fill="currentColor" />
        
        <circle cx="248" cy="220" r="1" fill="currentColor" />
        <circle cx="254" cy="220" r="1" fill="currentColor" />
        <circle cx="260" cy="220" r="1" fill="currentColor" />
      </g>
    </svg>
  );
}; 