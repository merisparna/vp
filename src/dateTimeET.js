const dateFormattedET = function() {
    let timeNow = new Date();
    const monthNamesET = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
    return timeNow.getDate() + '. ' + monthNamesET[timeNow.getMonth()] + ' ' + timeNow.getFullYear();
}

const addLeadZero = function(numValue) {
    if (numValue < 10) {
        numValue = '0' + numValue
    }
    return numValue
}

const timeFormattedET = function() {
    let timeNow = new Date();
    let hourNow = addLeadZero(timeNow.getHours());
    let minuteNow = addLeadZero(timeNow.getMinutes());
    let secondNow = addLeadZero(timeNow.getSeconds());

    let timeFormatted = hourNow + ':' + minuteNow + ':' + secondNow;
    return timeFormatted;
}

const weekDayET = function() {
    let weekDay = new Date().getDay()
    const weekDayNamesET = ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'] ;
    return weekDayNamesET[weekDay]
}


module.exports = {fullDate: dateFormattedET, fullTime: timeFormattedET, fullDay: weekDayET}