// Calculate time remaining (for pending status)
export const calculateTimeRemaining = ({
  createdAt,
}: {
  createdAt: string;
}) => {
  const createdTime = new Date(createdAt).getTime();
  const currentTime = new Date().getTime();
  const elapsedMinutes = Math.floor((currentTime - createdTime) / (1000 * 60));

  // Assuming payment window is 24 hours
  const totalMinutes = 24 * 60;
  const remainingMinutes = totalMinutes - elapsedMinutes;

  if (remainingMinutes <= 0) return { hours: 0, minutes: 0, percentage: 0 };

  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;
  const percentage = (remainingMinutes / totalMinutes) * 100;

  return { hours, minutes, percentage };
};
