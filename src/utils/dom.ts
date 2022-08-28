export const tooltipPosition = (e: any) => {
  let top = e.getBoundingClientRect().top;
  let height = e.clientHeight;

  return {
    position: top + 10 + height,
  };
};
