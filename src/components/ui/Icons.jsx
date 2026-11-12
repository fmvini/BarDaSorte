const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  glass: <><path d="M7 3h10l-1 7a4 4 0 0 1-8 0L7 3Z" /><path d="M12 14v7m-4 0h8" /></>,
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9m-9 12v-7h4v7" /></>,
  pantry: <><path d="M4 8h16l-1 13H5L4 8Z" /><path d="M8 8a4 4 0 0 1 8 0M8 12v5m4-5v5m4-5v5" /></>,
  heart: <path d="M20.8 8.8c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.1L12 19l-1.9-5.9L4 11l6.1-2.2L12 3Z" /><path d="m19 15 1.1 2.2L22 18l-1.9.8L19 21l-1-2.2-2-.8 2-.8 1-2.2Z" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  filter: <><path d="M4 6h16M7 12h10m-7 6h4" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
}
export function Icon({ name, size = 20, fill = 'none', ...props }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]}</svg>
}
