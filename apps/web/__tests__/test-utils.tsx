import { ReactElement } from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'

// Custom render function
export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { ...options })
}

// Re-export everything
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'