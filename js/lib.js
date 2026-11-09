// React + htm from a CDN, so the app needs no build step.
// `?deps=react@18.3.1` makes react-dom use the same React copy as the app.
import React from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1';
import htm from 'https://esm.sh/htm@3.1.1';

export const html = htm.bind(React.createElement);
export const { useState, useEffect, useMemo, useCallback, useRef } = React;
export { createRoot };
