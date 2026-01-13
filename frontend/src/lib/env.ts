export const ENV = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
    VERSION: process.env.NEXT_PUBLIC_API_VERSION ?? "api/v1",

    get BASE_API_URL() {
      if (!this.BASE_URL) {
        console.warn("Missing NEXT_PUBLIC_API_BASE_URL");
      }
      return `${this.BASE_URL}/${this.VERSION}`;
    },
  },
  CHATBOT: {
    BASE_URL: process.env.NEXT_PUBLIC_CHATBOT_API_BASE_URL ?? "",
    API_KEY: process.env.NEXT_PUBLIC_CHATBOT_API_KEY ?? "",
  },
};
