import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  levelFirst: true,
  colorize: true,
  translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
  ignore: "hostname,pid",
});

export const logger = pino(
  {
    // transport: {
    //   target: "pino-pretty",
    //   options: {
    //     translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
    //     ignore: "pid.hostname",
    //   },
    // },
    // level: "silent",
    browser: {
      // asObject: true,
      disabled: !import.meta.dev,
    },
  },
  stream,
);
