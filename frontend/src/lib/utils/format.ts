// Format currency to Vietnamese Dong
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Format currency without symbol
export const formatVNDShort = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

// Format pass score (0-10 scale)
export const formatPassScore = (score: number): string => {
  return `${score.toFixed(1)}/10`;
};

// Format final weight (0-1 scale to percentage)
export const formatFinalWeight = (weight: number): string => {
  return `${(weight * 100).toFixed(0)}%`;
};

// Format progress percentage
export const formatProgress = (progress: number): string => {
  return `${progress.toFixed(0)}%`;
};
