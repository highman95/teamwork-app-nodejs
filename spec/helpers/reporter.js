/* eslint-disable no-undef */
const { SpecReporter } = require("jasmine-spec-reporter");

jasmine.getEnv().clearReporters(); // remove default reporter logs
jasmine.getEnv().addReporter(new SpecReporter({ // add jasmine-spec-reporter
  // suite: { displayNumber: true },
  spec: { displayPending: true, displayDuration: true },
  summary: { displayDuration: true },
}));
