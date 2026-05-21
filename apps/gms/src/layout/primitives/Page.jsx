import React from "react";
import Container from "./Container.jsx";
import Stack from "./Stack.jsx";

/**
 * @typedef {"sm"|"md"|"lg"|"xl"|"max"} ContainerSize
 */

/**
 * @param {{
 *   title?: string,
 *   description?: React.ReactNode,
 *   actions?: React.ReactNode,
 *   containerSize?: ContainerSize,
 *   className?: string,
 *   children?: React.ReactNode
 * }} props
 */
export default function Page({
  title,
  description,
  actions,
  containerSize = "max",
  className = "",
  children,
}) {
  return (
    <div className={`gms-page ${className}`.trim()}>
      <Container size={containerSize}>
        <Stack>
          {(title || actions || description) && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--gms-spacing-4, 16px)" }}>
              <div>
                {title && <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{title}</h1>}
                {description && <div style={{ marginTop: 6, opacity: 0.75 }}>{description}</div>}
              </div>
              {actions && <div>{actions}</div>}
            </div>
          )}
          {children}
        </Stack>
      </Container>
    </div>
  );
}
