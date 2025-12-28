export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const ENV = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
    VERSION: process.env.NEXT_PUBLIC_API_VERSION ?? "api/v1",

    get BASE_API_URL() {
      if (!this.BASE_URL) {
        console.warn("Missing NEXT_PUBLIC_API_BASE_URL");
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
        return url.replace(/([^:]\/)\/+/g, "$1");
      }
      
      // If no version, return baseUrl (ensure no trailing slash)
      return baseUrl;
    },
  },
};
