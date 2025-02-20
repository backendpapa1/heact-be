


export const getCurrentWeekNumber = (date = new Date()) => {
    const currentDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    currentDate.setUTCDate(currentDate.getUTCDate() + 4 - (currentDate.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
    // @ts-ignore
    const weekNumber = Math.ceil(((currentDate - yearStart) / 86400000 + 1) / 7);
    return weekNumber;
  }
  