const generateSlots = (availability, unavailableDates, existingBookings, targetDateStr, slotDuration) => {
  const targetDate = new Date(targetDateStr);
  const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Check if date is in unavailableDates
  const isUnavailableDate = unavailableDates.some((date) => {
    return new Date(date).toISOString().split('T')[0] === targetDate.toISOString().split('T')[0];
  });

  if (isUnavailableDate) return [];
  
  const dayAvailability = availability[dayOfWeek];
  if (!dayAvailability || !dayAvailability.isAvailable) return [];

  const slots = [];
  const startParts = dayAvailability.startTime.split(':');
  const endParts = dayAvailability.endTime.split(':');
  
  let currentStartTime = new Date(targetDate);
  currentStartTime.setHours(parseInt(startParts[0], 10), parseInt(startParts[1], 10), 0, 0);
  
  const endTime = new Date(targetDate);
  endTime.setHours(parseInt(endParts[0], 10), parseInt(endParts[1], 10), 0, 0);

  while (currentStartTime < endTime) {
    const slotEndTime = new Date(currentStartTime.getTime() + slotDuration * 60000);
    if (slotEndTime > endTime) break;

    const timeStr = currentStartTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const endTimeStr = slotEndTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Check existing bookings
    const hasConflict = existingBookings.some(booking => {
      return (timeStr >= booking.startTime && timeStr < booking.endTime) ||
             (endTimeStr > booking.startTime && endTimeStr <= booking.endTime) ||
             (timeStr <= booking.startTime && endTimeStr >= booking.endTime);
    });

    slots.push({
      time: timeStr,
      endTime: endTimeStr,
      available: !hasConflict
    });

    currentStartTime = slotEndTime;
  }

  return slots;
};

module.exports = { generateSlots };
