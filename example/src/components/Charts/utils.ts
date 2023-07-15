export const angleTheme = {
  stroke: { color: '#eb4034', width: 5 },
  scatter: { default: { width: 4, height: 4, rx: 2 } },
};

export const speedTheme = {
  stroke: {
    color: '#ffa502',
    width: 5,
  },
};

export const verticalTheme = {
  labels: { formatter: (v: number) => v.toFixed(2) },
};

export const horizontalTheme = {
  labels: {
    formatter: (seconds: number) =>
      new Date(1000 * seconds).toISOString().slice(14, 19),
  },
};
