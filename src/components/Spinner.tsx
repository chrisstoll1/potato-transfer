'use client'

import React, { JSX } from 'react'
import { useRotatingSpinner } from '../hooks/useRotatingSpinner'

export default function Spinner({
  direction,
}: {
  direction: 'up' | 'down'
}): JSX.Element {
  const isRotating = useRotatingSpinner()
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72">
      <svg
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className={isRotating ? 'motion-safe:animate-spin-slow' : ''}
        role="img"
        aria-label={isRotating ? 'Rotating potato' : 'Potato'}
      >
        <path
          d="M94 15C111 24 119 42 113 61c-4 12-1 20-10 32-11 16-31 25-51 22-20-3-37-17-39-35-2-17 8-28 18-38C45 28 52 13 70 11c9-1 17 0 24 4Z"
          fill="#D8AB70"
          stroke="#78512F"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M31 77c-1 15 12 26 27 28 17 3 31-3 42-13"
          fill="none"
          stroke="#BE8B50"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M51 39c5-7 12-13 21-14"
          fill="none"
          stroke="#F4D4A4"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <g fill="#916338">
          <ellipse
            cx="84"
            cy="31"
            rx="3"
            ry="4"
            transform="rotate(-25 84 31)"
          />
          <ellipse cx="100" cy="51" rx="3" ry="2" />
          <ellipse
            cx="37"
            cy="58"
            rx="2.5"
            ry="4"
            transform="rotate(35 37 58)"
          />
          <ellipse cx="32" cy="84" rx="3" ry="2" />
          <ellipse cx="68" cy="100" rx="3" ry="2" />
          <ellipse cx="95" cy="83" rx="2" ry="3" />
        </g>
      </svg>
      <svg
        viewBox="0 0 128 128"
        className={`absolute inset-0 transition-transform duration-150 ${direction === 'down' ? 'rotate-180' : ''}`}
        fill="none"
        role="img"
        aria-label={`Arrow pointing ${direction}`}
        style={{ viewTransitionName: 'arrow-direction' }}
      >
        <path
          d="M64 43 44 63h12v23h16V63h12L64 43Z"
          fill="#FFFAF0"
          stroke="#78512F"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
