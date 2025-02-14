// utils.ts
export const validatePreferredTime = async (_: any, value: string): Promise<void> => {
    if (!value) {
        return Promise.reject(new Error('Preferred time is required.'));
    }

    // Regular expression for "HH:MM AM/PM" format
    const timeFormatRegex = /^([0]?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

    // Function to convert time to AM/PM format
    const convertToAmPm = (time: string): string | null => {
        if (!time) return null;
        const [hour, minute] = time.split(':');
        let hours = parseInt(hour, 10);
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for AM times
        return `${hours}:${minute} ${period}`;
    };

    const formattedTime = convertToAmPm(value);

    if (formattedTime && timeFormatRegex.test(formattedTime)) {
        return Promise.resolve();
    }

    return Promise.reject(new Error('Preferred time must be in the format HH:MM AM/PM.'));
};

