export const getTimeObject = (timing: number)=>{
    const miliseconds = Math.floor(Math.floor(timing % 1000)/10),
        seconds = Math.floor((timing / 1000) % 60),
        minutes = Math.floor((timing / (1000 * 60))% 60),
        hours =  Math.floor(timing / (1000 * 60 * 60))


    return {hours, minutes, seconds, miliseconds}
}
export const getTimeString = (timing: number)=>{
    const {hours, minutes, seconds, miliseconds} = getTimeObject(timing)
        
    let time = '00:00:00'
    if (hours > 0) {
        time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(miliseconds).padStart(2, '0')}`
    }
    else {
        time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(miliseconds).padStart(2, '0')}`
    }
    return time
}
export const getTimeSinceDate = (timing: string | number | Date, locale:string) => {
    const now = Date.now();
    const time = new Date(timing).getTime();
    const secondsSinceDate = Math.floor((now - time) / 1000);

    let displayText = '';

    if (secondsSinceDate < 60) {
        displayText = `${secondsSinceDate} secs ${locale == 'pt' ? 'atras' : 'ago'}`;
    } else if (secondsSinceDate < 3600) {
        const minutes = Math.floor(secondsSinceDate / 60);
        displayText = `${minutes} mins ${locale == 'pt' ? 'atras' : 'ago'}`;
    } else if (secondsSinceDate < 86400) {
        const hours = Math.floor(secondsSinceDate / 3600);
        displayText = `${hours} ${locale == 'pt' ? 'horas atras' : 'hours ago'}`;
    } else if (secondsSinceDate < 604800) {
        const days = Math.floor(secondsSinceDate / 86400);
        displayText = `${days} ${locale == 'pt' ? 'dias atras' : 'days ago'}`;
    } else if (secondsSinceDate < 2628000) {
        const weeks = Math.floor(secondsSinceDate / 604800);
        displayText = `${weeks} ${locale == 'pt' ? 'semanas atras' : 'weeks ago'}`;
    } else if (secondsSinceDate < 31536000) {
        const months = Math.floor(secondsSinceDate / 2628000);
        displayText = `${months} ${locale == 'pt' ? 'meses atras' : 'months ago'}`;
    } else {
        const years = Math.floor(secondsSinceDate / 31536000);
        displayText = `${years} ${locale == 'pt' ? 'anos atras' : 'years ago'}`;
    }

    const isoDate = new Date(timing).toISOString();
    return {isoDate, displayText}
};