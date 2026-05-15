import "../globals.css"

import {
  LayoutWrapper
} from "@/components/layoutWrapper"

export default function ClienteRoot({
  children
}) {

  return (
        <LayoutWrapper>

          {children}

        </LayoutWrapper>
  )
}