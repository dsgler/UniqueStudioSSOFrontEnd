type TargetContext = '_self' | '_parent' | '_blank' | '_top';

export const openWindow = (
  url: string,
  opts?: { target?: TargetContext; [key: string]: any },
) => {
  const { target = '_blank', ...others } = opts || {};
  window.open(
    url,
    target,
    Object.entries(others)
      .reduce((preValue: string[], curValue) => {
        const [key, value] = curValue;
        return [...preValue, `${key}=${value}`];
      }, [])
      .join(','),
  );
};

export const regexUrl = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i',
);

export const downloadFile = (data: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(data);

  // web
  try {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 给一定时间执行下载
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);

    return; // success
  } catch (e) {
    // throw new Error(`web下载失败: ${e}`);
  }

  // iframe兼容部分app的WebView
  try {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.body.removeChild(iframe);
      window.URL.revokeObjectURL(url);
    }, 2000);

    return;
  } catch (e) {
    // throw new Error(`iframe下载失败: ${e}`);
  }

  // 兜底方案
  try {
    window.open(url, '_blank');
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 5000);
  } catch (e) {
    // throw new Error(`下载失败: ${e}`);
    window.URL.revokeObjectURL(url);
  }
};

export const getRecruitmentName = (t: (x: string) => string, name: string) => {
  if (!/(\d+)(S|C|A)/.test(name)) return name;
  const [_, year, state] = name.match(/(\d+)(S|C|A)/)!;
  return `${year}${t(`common.rec.name.${state}`)}`;
};

export const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const transformedTime = (start: string, end: string) => {
  const startTime = new Date(start);
  const endTime = new Date(end);

  const startHours = startTime.getHours().toString().padStart(2, '0');
  const startMinutes = startTime.getMinutes().toString().padStart(2, '0');
  const endHours = endTime.getHours().toString().padStart(2, '0');
  const endMinutes = endTime.getMinutes().toString().padStart(2, '0');

  return `${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
};
