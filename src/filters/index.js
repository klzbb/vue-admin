/*
 * @Descripttion: DOP
 * @version: 1.0.0
 * @Author: Author
 * @Date: 2020-07-27 17:29:06
 * @LastEditors: konglingzhan
 * @LastEditTime: 2020-08-17 14:00:19
 */
// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils';

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 权限点类型 1-菜单 2-按钮 3-其他
 * @param {Number} type
 */
export function v10001(type) {
  let text;
  switch (type) {
    case 1:
      text = '菜单';
      break;
    case 2:
      text = '按钮';
      break;
    case 3:
      text = '其他';
      break;
    default:
      break;
  }
  return text;
}

/**
 * 用户状态
 * @param {Number} status
 */
export function v10002(status) {
  let text;
  switch (status) {
    case 0:
      text = '无效';
      break;
    case 1:
      text = '正常';
      break;
    case 2:
      text = '冻结';
      break;
    default:
      break;
  }
  return text;
}

