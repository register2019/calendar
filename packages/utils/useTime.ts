export const getCurrTime = () => {
  const date = new Date();
  return {
    hour:
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours().toString(),
    minu:
      date.getMinutes() < 10
        ? "0" + date.getMinutes()
        : date.getMinutes().toString(),
    seco:
      date.getSeconds() < 10
        ? "0" + date.getSeconds()
        : date.getSeconds().toString(),
  };
};
