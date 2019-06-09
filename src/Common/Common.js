exports.convertDate = (date) => {
    let dateArr = date.split("T");
    let dateHour = dateArr[1].split("Z");

    return dateArr[0];

}

exports.mapingParams = (obj) => {
    let paramsResult = "?"
    Object.keys(obj).forEach(function (k) {
        paramsResult += k + "=" + obj[k] + "&"
    });
    return paramsResult
}