import dayjs from "dayjs";
// fork from innei
export enum DateFormat {
  "MMM DD YYYY",
  "HH:mm",
  "LLLL",
  "H:mm:ss A",
  "YYYY-MM-DD",
  "YYYY-MM-DD dddd",
  "YYYY-MM-DD ddd",
  "MM-DD ddd",
  "YYYY 年 M 月 D 日 dddd",
}

export const parseDate = (
  time: string | Date,
  format: keyof typeof DateFormat
) => dayjs(time).format(format);

export const relativeTime = (time: Date | string, current = new Date()) => {
  if (!time) return "";
  time = new Date(time);
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = +current - +time;
  //   todo 判断多久后

  if (elapsed < msPerMinute) {
    const gap = Math.ceil(elapsed / 1000);
    return gap <= 0 ? "刚刚" : `${gap} 秒前`;
  } else if (elapsed < msPerHour) {
    return `${Math.round(elapsed / msPerMinute)} 分钟前`;
  } else if (elapsed < msPerDay) {
    return `${Math.round(elapsed / msPerHour)} 小时前`;
  } else if (elapsed < msPerMonth) {
    return `${Math.round(elapsed / msPerDay)} 天前`;
  } else if (elapsed < msPerYear) {
    return `${Math.round(elapsed / msPerMonth)} 个月前`;
  } else {
    return `${Math.round(elapsed / msPerYear)} 年前`;
  }
};

export const getLocation = async (): Promise<{
  city: string;
  region: string;
  country: string;
}> => {
  const res = await fetch("https://ip.sb/json");
  const data = await res.json();
  const ip = data.ip;
  if (ip) {
    const response = await fetch(`https://api.vore.top/api/IPdata?ip=${ip}`);

    const data = await response.json();
    console.log(data);
    return {
      city: data.city,
      region: data.region,
      country: data.country,
    }; // 返回城市、地区和国家信息
  }
  return {
    city: "",
    region: "",
    country: "",
  };
};
