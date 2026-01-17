export function calculateACRScore(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  
  const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const date of sortedDates) {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
}