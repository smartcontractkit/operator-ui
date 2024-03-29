/* eslint react/no-unknown-property: 0 */
import React, { FC, SVGProps } from 'react'

const ErrorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 48 48" {...props}>
    <path
      d="M24 48C10.8 48 0 37.2 0 24S10.8 0 24 0s24 10.8 24 24-10.8 24-24 24zm0-44C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z"
      fill="transparent"
    />
    <circle cx={24} cy={24} r={20} fill="#ffecf0" />
    <path
      d="M16.8 30.9H31c.5 0 1-.3 1.2-.8.3-.6.3-1.2.1-1.8l-6.5-11c-.4-.8-1.1-1.3-1.9-1.4-.8.1-1.6.6-1.9 1.3l-6.4 11c-.3.6-.3 1.3.1 1.8.1.5.6.8 1.1.9zm7.1-5.5c-.4 0-.7-.4-.7-.8l-.4-3.4c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1l-.4 3.4c0 .4-.3.8-.7.8zm0 1.1c.6 0 1.1.5 1.1 1.1v.1c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1c0-.6.5-1.1 1.1-1.2zm-7.1 5.8c-1 0-2-.6-2.5-1.5-.6-1-.6-2.3-.1-3.3l6.5-11.2c.6-1.2 1.8-2 3.1-2.1 1.3.1 2.5.9 3.1 2l6.5 11.1c.5 1.1.5 2.3-.1 3.4-.5.9-1.4 1.4-2.4 1.5l-14.1.1z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#ff4169"
    />
  </svg>
)

export default ErrorIcon
