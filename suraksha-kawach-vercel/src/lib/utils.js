import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export const getPriorityInfo = (priority) => {
  if (priority >= 6) {
    return { label: "High", color: "text-red-600 bg-red-50 border-red-200" }
  } else if (priority >= 3) {
    return { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" }
  } else {
    return { label: "Low", color: "text-blue-600 bg-blue-50 border-blue-200" }
  }
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const parseServerResponse = (response) => {
  return JSON.parse(JSON.stringify(response))
}

export const formattedDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
};


// Sample analytics data
export const analyticsData = {
  activeTickets: 12,
  resolvedToday: 8,
  avgResponseTime: "4.2 min",
  priorityDistribution: {
    high: 5,
    medium: 8,
    low: 7,
  },
}

export const getSpecificErrorMessage = (service, result, context) => {
  const { ticketId, firebaseUID } = context;

  if (result.status === 'rejected') {
    const reason = result.reason;

    // Handle axios errors specifically
    if (reason?.response) {
      const status = reason.response.status;
      const data = reason.response.data;

      switch (status) {
        case 404:
          return `${service} not found: ${data?.message || `${service} does not exist`}`;
        case 401:
          return `Authentication failed: ${data?.message || 'Please log in again'}`;
        case 403:
          return `Access denied: ${data?.message || `You don't have permission to view this ${service}`}`;
        case 500:
          return `Server error: ${data?.message || `${service} service is temporarily unavailable`}`;
        case 429:
          return `Rate limited: ${data?.message || 'Too many requests, please try again later'}`;
        default:
          return `${service} request failed (${status}): ${data?.message || reason.message}`;
      }
    }

    // Network errors
    if (reason?.code === 'NETWORK_ERROR') {
      return `Network connection failed while loading ${service}`;
    }

    return `Failed to load ${service}: ${reason?.message || 'Unknown network error'}`;
  }

  // Handle your custom API response format
  if (result.value?.status === 'FAIL') {
    const message = result.value.message;

    // Map common error messages to user-friendly ones
    const errorMap = {
      'Unauthorized': `Access denied: Please verify your permissions for ${service}`,
      'Not Found': `${service} not found: ${service === 'ticket' ? `Ticket ${ticketId}` : `User ${firebaseUID}`} does not exist`,
      'Invalid credentials': 'Authentication failed: Please log in again',
      'Rate limit exceeded': 'Too many requests: Please wait before trying again'
    };

    return errorMap[message] || `${service} error: ${message}`;
  }

  return null; // No error
};
