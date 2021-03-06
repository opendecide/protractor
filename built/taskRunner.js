"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const events_1 = require("events");
const configParser_1 = require("./configParser");
const runner_1 = require("./runner");
const taskLogger_1 = require("./taskLogger");
/**
 * A runner for running a specified task (capabilities + specs).
 * The TaskRunner can either run the task from the current process (via
 * './runner.js') or from a new process (via './runnerCli.js').
 *
 * @constructor
 * @param {string} configFile Path of test configuration.
 * @param {object} additionalConfig Additional configuration.
 * @param {object} task Task to run.
 * @param {boolean} runInFork Whether to run test in a forked process.
 * @constructor
 */
class TaskRunner extends events_1.EventEmitter {
    constructor(configFile, additionalConfig, task, runInFork) {
        super();
        this.configFile = configFile;
        this.additionalConfig = additionalConfig;
        this.task = task;
        this.runInFork = runInFork;
    }
    /**
     * Sends the run command.
     * @return {Promise} A promise that will resolve when the task finishes
     *     running. The promise contains the following parameters representing the
     *     result of the run:
     *       taskId, specs, capabilities, failedCount, exitCode, specResults
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let runResults = {
                taskId: this.task.taskId,
                specs: this.task.specs,
                capabilities: this.task.capabilities,
                // The following are populated while running the test:
                failedCount: 0,
                exitCode: -1,
                specResults: []
            };
            let configParser = new configParser_1.ConfigParser();
            if (this.configFile) {
                configParser.addFileConfig(this.configFile);
            }
            if (this.additionalConfig) {
                configParser.addConfig(this.additionalConfig);
            }
            let config = configParser.getConfig();
            config.capabilities = this.task.capabilities;
            config.specs = this.task.specs;
            if (this.runInFork) {
                return new Promise((resolve, reject) => {
                    let childProcess = child_process.fork(__dirname + '/runnerCli.js', process.argv.slice(2), { cwd: process.cwd(), silent: true });
                    let taskLogger = new taskLogger_1.TaskLogger(this.task, childProcess.pid);
                    // stdout pipe
                    childProcess.stdout.on('data', (data) => {
                        taskLogger.log(data);
                    });
                    // stderr pipe
                    childProcess.stderr.on('data', (data) => {
                        taskLogger.log(data);
                    });
                    childProcess
                        .on('message', (m) => {
                        if (config.verboseMultiSessions) {
                            taskLogger.peek();
                        }
                        switch (m.event) {
                            case 'testPass':
                                process.stdout.write('.');
                                break;
                            case 'testFail':
                                process.stdout.write('F');
                                break;
                            case 'testsDone':
                                runResults.failedCount = m.results.failedCount;
                                runResults.specResults = m.results.specResults;
                                break;
                        }
                    })
                        .on('error', (err) => {
                        taskLogger.flush();
                        reject(err);
                    })
                        .on('exit', (code) => {
                        taskLogger.flush();
                        runResults.exitCode = code;
                        resolve(runResults);
                    });
                    childProcess.send({
                        command: 'run',
                        configFile: this.configFile,
                        additionalConfig: this.additionalConfig,
                        capabilities: this.task.capabilities,
                        specs: this.task.specs
                    });
                });
            }
            else {
                let runner = new runner_1.Runner(config);
                runner.on('testsDone', (results) => {
                    runResults.failedCount = results.failedCount;
                    runResults.specResults = results.specResults;
                });
                const exitCode = yield runner.run();
                runResults.exitCode = exitCode;
                return runResults;
            }
        });
    }
}
exports.TaskRunner = TaskRunner;
//# sourceMappingURL=taskRunner.js.map