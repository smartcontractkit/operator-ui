/* eslint react/no-unknown-property: 0 */
import React, { FC, SVGProps } from 'react'

const Pending: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg id="prefix__Layer_1" data-name="Layer 1" viewBox="0 0 48 48" {...props}>
    <defs>
      <style>{'.prefix__cls-3{fill:#b0b0b0}'}</style>
    </defs>
    <g id="prefix__Time-Icon">
      <circle
        id="prefix__path-1"
        cx={24}
        cy={24}
        r={20}
        fill="#f0f0f0"
        className="pending-icon"
      />
    </g>
    <g id="prefix__Time-Icon-2" data-name="Time-Icon">
      <g id="prefix__Shape">
        <path
          className="prefix__cls-3"
          d="M23.94 11.64a11.83 11.83 0 1 0 11.84 11.83 11.82 11.82 0 0 0-11.84-11.83zm0 21.29a9.46 9.46 0 1 1 9.46-9.46 9.46 9.46 0 0 1-9.4 9.46z"
        />
        <path fill="none" d="M9.77 9.28h28.38v28.38H9.77V9.28z" />
        <path
          className="prefix__cls-3"
          d="M24.55 17.56h-1.78v7.09l6.21 3.73.89-1.46-5.32-3.16v-6.2z"
        />
      </g>
    </g>
  </svg>
)

export default Pending
