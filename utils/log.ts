import pino from "pino";
// import "pino-pretty";

export const logger = pino({
  // transport: {
  //   target: "pino-pretty",
  //   options: {
  //     translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
  //     ignore: "pid,hostname",
  //   },
  // },
  browser: {
    // asObject: true,
    disabled: !import.meta.dev,
  },
});
