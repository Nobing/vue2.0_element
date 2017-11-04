export function formatDate(time) {
  let add0 = (num) => {
    return num < 10 ? '0' + num : '' + num
  }
  let date = new Date(time);
  return add0(date.getFullYear()) + '-' + add0((date.getMonth() + 1)) + '-' + add0(date.getDate()) + ' ' + add0(date.getHours()) + ':' + add0(date.getMinutes())// + ':' + add0(date.getSeconds());
}
