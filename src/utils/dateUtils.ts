/**
 * Format date string to a more readable format
 * @param dateString Date string in format YYYY-MM-DD
 * @returns Formatted date string (e.g., "July 16, 2023")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Format time string to a more readable format
 * @param timeString Time string in format HH:MM:SS
 * @returns Formatted time string (e.g., "14:00")
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  
  // Remove seconds part if present
  return timeString.split(':').slice(0, 2).join(':');
};

/**
 * Check if a date is in the past
 * @param dateString Date string in format YYYY-MM-DD
 * @param timeString Optional time string in format HH:MM:SS
 * @returns Boolean indicating if the date is in the past
 */
export const isPastDate = (dateString: string, timeString?: string): boolean => {
  if (!dateString) return false;
  
  const dateTime = timeString 
    ? `${dateString}T${timeString}` 
    : dateString;
    
  return new Date(dateTime) < new Date();
};

/**
 * Get relative time description (e.g., "in 3 days", "yesterday")
 * @param dateString Date string in format YYYY-MM-DD
 * @returns String with relative time description
 */
export const getRelativeTimeDescription = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

/**
 * Calculate time remaining until a specific date and time
 * @param dateString Date string in format YYYY-MM-DD
 * @param timeString Time string in format HH:MM:SS
 * @returns Object containing days, hours, minutes, and seconds remaining
 */
export const getTimeRemaining = (dateString: string, timeString: string) => {
  const targetDate = new Date(`${dateString}T${timeString}`);
  const now = new Date();
  
  const total = targetDate.getTime() - now.getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    isExpired: total <= 0
  };
};