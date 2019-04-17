function keepTime(data) {
  var result = '';
  var str = data;
  //将字符串转换成时间格式
  var timePublish = new Date(str);
  var timeNow = new Date();
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var diffValue = timeNow - timePublish;
  var diffMonth = diffValue / month;
  var diffWeek = diffValue / (7 * day);
  var diffDay = diffValue / day;
  var diffHour = diffValue / hour;
  var diffMinute = diffValue / minute;
  if (diffValue < 0) {
      alert("错误时间");
  }
  else if (diffMonth > 3) {
       result = timePublish.getFullYear()+"-";
           result += timePublish.getMonth() + "-";
      result += timePublish.getDate();
      return result
  }
  else if (diffMonth > 1) {
      result = parseInt(diffMonth) + "月前";
      return result

  }
  else if (diffWeek > 1) {
      result = parseInt(diffWeek) + "周前";
      return result

  }
  else if (diffDay > 1) {
      result = parseInt(diffDay) + "天前";
      return result

  }
  else if (diffHour > 1) {
      result = parseInt(diffHour) + "小时前";
      return result

  }
  else if (diffMinute > 1) {
      result = parseInt(diffMinute) + "分钟前";
      return result

  }
  else {
      result = "刚刚发表";
      return result

  }
  return result;
}
export default keepTime
