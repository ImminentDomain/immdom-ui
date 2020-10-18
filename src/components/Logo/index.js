import React from 'react'
import styles from './Logo.css'


function Logo({ color = "#000" }) {
  return (
    <svg
      viewBox="0 0 48 47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '5.5rem' }}
    >
      <ellipse cx="8.12189" cy="15" rx="3.12189" ry="3" fill={color} />
      <ellipse cx="8.12189" cy="32" rx="3.12189" ry="3" fill={color} />
      <ellipse cx="39.8777" cy="15" rx="3.12189" ry="3" fill={color} />
      <ellipse cx="23.4871" cy="23" rx="3.12189" ry="3" fill={color} />
      <ellipse cx="39.8777" cy="32" rx="3.12189" ry="3" fill={color} />
      <ellipse
        cx="24.0008"
        cy="42"
        rx="3"
        ry="3.12189"
        transform="rotate(-90 24.0008 42)"
        fill={color}
      />
      <ellipse
        cx="24.0008"
        cy="5"
        rx="3"
        ry="3.12189"
        transform="rotate(-90 24.0008 5)"
        fill={color}
      />
    </svg>
  );
}

export default Logo;