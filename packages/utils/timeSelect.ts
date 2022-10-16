export type SelectOptions = {
  start: string;
  step: string;
  end: string;
};

export const initTimeSelectPanel = ({ start, step, end }: SelectOptions) => {
  const initStart = start.split(":");
  const initStep = step.split(":");
  const initEnd = end.split(":");

  const startTimeStamp = calculateTimeStamp(initStart);
  const stepTimeStamp = calculateTimeStamp(initStep);
  const endTimeStamp = calculateTimeStamp(initEnd);

  let circulateNum = (endTimeStamp - startTimeStamp) / stepTimeStamp;

  let circulateResult = [start];
  let initTimeHour = Number(initStart[0]);
  let initTimeSeco = Number(initStart[1]);
  for (let i = 0; i < circulateNum; i++) {
    initTimeSeco += stepTimeStamp;
    if (initTimeSeco >= 60) {
      initTimeHour += 1;
      initTimeSeco -= 60;
    }
    if (
      initTimeHour === Number(initEnd[0]) &&
      initTimeSeco > Number(initEnd[1])
    ) {
      initTimeHour = Number(initEnd[0]);
      initTimeSeco = Number(initEnd[1]);
    }
    let pushHour = initTimeHour < 10 ? "0" + initTimeHour : initTimeHour;
    let pushSeco = initTimeSeco < 10 ? "0" + initTimeSeco : initTimeSeco;
    circulateResult.push(pushHour + ":" + pushSeco);
  }

  return circulateResult;
};

export const calculateTimeStamp = (val: string[]) =>
  Number(val[0]) * 60 + Number(val[1]);
