/**
 * Consistent Design Tokens and Utility Classes
 * Use these constants for consistent styling across all teacher management pages
 */

// ============================================
// COLOR CLASSES (Dark Mode Support)
// ============================================

export const colors = {
  // Background
  bg: {
    page: "bg-slate-50 dark:bg-slate-950",
    card: "bg-white dark:bg-slate-900",
    secondary: "bg-slate-50 dark:bg-slate-800",
    hover: "hover:bg-slate-100 dark:hover:bg-slate-800",
  },

  // Borders
  border: {
    default: "border-slate-200 dark:border-slate-800",
    light: "border-slate-100 dark:border-slate-700",
    focus: "focus:border-indigo-500 dark:focus:border-indigo-400",
  },

  // Text
  text: {
    primary: "text-slate-900 dark:text-white",
    secondary: "text-slate-600 dark:text-slate-400",
    muted: "text-slate-500 dark:text-slate-500",
    link: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300",
  },

  // Status Colors
  status: {
    success:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    warning:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  },
};

// ============================================
// COMPONENT CLASSES
// ============================================

export const components = {
  // Cards
  card: `${colors.bg.card} ${colors.border.default} rounded-2xl shadow-lg`,
  cardHover: `${colors.bg.card} ${colors.border.default} rounded-2xl shadow-lg hover:shadow-xl transition-shadow`,

  // Inputs
  input: `w-full px-4 py-2.5 ${colors.bg.secondary} ${colors.border.default} rounded-lg ${colors.text.primary} placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`,

  // Buttons
  button: {
    primary:
      "px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-lg",
    secondary: `px-4 py-2.5 ${colors.bg.card} ${colors.border.default} ${colors.text.primary} rounded-lg font-medium transition-colors ${colors.bg.hover}`,
    danger:
      "px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg font-medium transition-colors",
    ghost: `px-4 py-2.5 ${colors.text.secondary} hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors`,
  },

  // Badges
  badge: {
    default: "px-3 py-1 rounded-full text-xs font-semibold",
    success: `px-3 py-1 ${colors.status.success} rounded-full text-xs font-semibold`,
    warning: `px-3 py-1 ${colors.status.warning} rounded-full text-xs font-semibold`,
    error: `px-3 py-1 ${colors.status.error} rounded-full text-xs font-semibold`,
    info: `px-3 py-1 ${colors.status.info} rounded-full text-xs font-semibold`,
  },

  // Stats Cards
  statCard: `${colors.bg.card} rounded-2xl ${colors.border.default} p-6 shadow-lg`,
  statIcon: (color: string) =>
    `p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl`,

  // Tables
  table: {
    container: `${colors.bg.card} rounded-2xl ${colors.border.default} shadow-lg overflow-hidden`,
    header: `bg-slate-50 dark:bg-slate-800 ${colors.border.default}`,
    row: `${colors.bg.hover} transition-colors ${colors.border.default}`,
    cell: `px-6 py-4 ${colors.text.primary}`,
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get status badge classes based on status string
 */
export const getStatusBadge = (status: string) => {
  const statusMap: Record<string, string> = {
    ACTIVE: colors.status.success,
    COMPLETED: colors.status.info,
    PENDING: colors.status.warning,
    CANCELLED: colors.status.error,
    EXPIRED: colors.status.error,
    SUCCESS: colors.status.success,
    FAILED: colors.status.error,
  };

  return `px-3 py-1 ${
    statusMap[status] || colors.status.info
  } rounded-full text-xs font-semibold`;
};

/**
 * Get icon wrapper classes based on color
 */
export const getIconWrapper = (
  color: "indigo" | "emerald" | "orange" | "blue" | "purple" | "red"
) => {
  const colorMap = {
    indigo:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    emerald:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    orange:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  };

  return `w-10 h-10 rounded-full ${colorMap[color]} flex items-center justify-center`;
};

/**
 * Get gradient classes for featured cards
 */
export const getGradient = (
  variant: "primary" | "success" | "warning" | "info"
) => {
  const gradients = {
    primary: "bg-gradient-to-br from-indigo-600 to-purple-600",
    success: "bg-gradient-to-br from-emerald-600 to-teal-600",
    warning: "bg-gradient-to-br from-orange-600 to-red-600",
    info: "bg-gradient-to-br from-blue-600 to-cyan-600",
  };

  return gradients[variant];
};

/**
 * Format currency (Vietnamese Dong)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Format number with locale
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

/**
 * Format date
 */
export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Intl.DateTimeFormat(
    "vi-VN",
    options || {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(new Date(dateString));
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("vi-VN");
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Get avatar URL or generate placeholder
 */
export const getAvatarUrl = (url: string | null, name: string): string => {
  if (url) return url;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=6366f1&color=fff`;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get progress bar color based on percentage
 */
export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return "bg-emerald-600";
  if (percentage >= 50) return "bg-blue-600";
  if (percentage >= 30) return "bg-orange-600";
  return "bg-red-600";
};

// ============================================
// ANIMATION CLASSES
// ============================================

export const animations = {
  fadeIn: "animate-in fade-in duration-300",
  slideIn: "animate-in slide-in-from-bottom duration-300",
  spin: "animate-spin",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
};

// ============================================
// LAYOUT CLASSES
// ============================================

export const layouts = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  page: `min-h-screen ${colors.bg.page}`,
  section: "space-y-6",
  grid: {
    cols2: "grid grid-cols-1 md:grid-cols-2 gap-6",
    cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    cols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  },
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Example 1: Using card component
<div className={components.card}>
    <h2 className={colors.text.primary}>Title</h2>
    <p className={colors.text.secondary}>Description</p>
</div>

// Example 2: Using status badge
<span className={getStatusBadge("ACTIVE")}>Active</span>

// Example 3: Using button
<button className={components.button.primary}>
    Click Me
</button>

// Example 4: Using input
<input 
    type="text" 
    className={components.input}
    placeholder="Search..."
/>

// Example 5: Using stat card with icon
<div className={components.statCard}>
    <div className={getIconWrapper("indigo")}>
        <Icon className="w-6 h-6" />
    </div>
    <p className={colors.text.secondary}>Revenue</p>
    <p className={colors.text.primary}>{formatCurrency(125000)}</p>
</div>

// Example 6: Using layout
<div className={layouts.page}>
    <div className={layouts.container}>
        <div className={layouts.grid.cols4}>
            {/* Cards here *\/}
        </div>
    </div>
</div>
*/
