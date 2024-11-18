export const BoardNotFoundIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      {/* Main Board Outline */}
      <rect
        x="80"
        y="40"
        width="240"
        height="180"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 6"
        className="opacity-30"
      />

      {/* Kanban Cards */}
      <g className="opacity-30">
        <rect
          x="100"
          y="60"
          width="40"
          height="30"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="260"
          y="60"
          width="40"
          height="30"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>

      {/* Magnifying Glass */}
      <g className="opacity-70">
        <circle
          cx="200"
          cy="140"
          r="45"
          stroke="currentColor"
          strokeWidth="3"
        />
        <line
          x1="230"
          y1="175"
          x2="260"
          y2="205"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Question Mark */}
      <path
        d="M190 135C190 125 195 120 200 120C205 120 210 125 210 130C210 140 200 140 200 150"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-90"
      />
      <circle
        cx="200"
        cy="160"
        r="2.5"
        fill="currentColor"
        className="opacity-90"
      />

      {/* Decorative Dots */}
      <g className="opacity-30">
        <circle cx="100" cy="180" r="2" fill="currentColor" />
        <circle cx="110" cy="180" r="2" fill="currentColor" />
        <circle cx="120" cy="180" r="2" fill="currentColor" />
        
        <circle cx="280" cy="180" r="2" fill="currentColor" />
        <circle cx="290" cy="180" r="2" fill="currentColor" />
        <circle cx="300" cy="180" r="2" fill="currentColor" />
      </g>
    </svg>
  );
}; 