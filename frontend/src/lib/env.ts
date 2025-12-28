export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const ENV = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
    VERSION: process.env.NEXT_PUBLIC_API_VERSION ?? "api/v1",

    get BASE_API_URL() {
      if (!this.BASE_URL) {
        const errorMsg = "Missing NEXT_PUBLIC_API_BASE_URL - API calls will fail!";
        console.error(errorMsg);
        if (process.env.NODE_ENV === "development") {
          console.error("Please set NEXT_PUBLIC_API_BASE_URL in .env.local");
        }
        return "";
      }

      // Trim trailing slash from BASE_URL
      let baseUrl = this.BASE_URL.trim().replace(/\/+$/, "");
      
      // Trim leading slash from VERSION
      let version = this.VERSION.trim().replace(/^\/+/, "");

      // Build final URL
      if (version) {
        // Ensure no double slashes
        const url = `${baseUrl}/${version}`;
        const finalUrl = url.replace(/([^:]\/)\/+/g, "$1");
        
        // DEV: Log final URL
        if (process.env.NODE_ENV === "development") {
          console.log("[ENV] API Base URL:", finalUrl);
        }
        
        return finalUrl;
      }
      
      // If no version, return baseUrl (ensure no trailing slash)
      if (process.env.NODE_ENV === "development") {
        console.log("[ENV] API Base URL:", baseUrl);
      }
      return baseUrl;
    },
  },
};
