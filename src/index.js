const path = require('path');

const env = require('jsdoc/lib/jsdoc/env');
const logger = require('jsdoc/lib/jsdoc/util/logger');
const makef = require('makef');

const packageName = require('../package.json').name;

function log(message, level) {
    logger[level || 'info'](`${packageName}: ${message}`);
}

exports.handlers = {
    processingComplete: function processingComplete() {
        const opts = env.opts;
        const fileSet = opts.fileSet;
        const fileType = typeof fileSet;

        if (fileSet && (fileType === 'string' || fileType === 'object')) {
            const docDir = path.join(env.pwd, opts.destination);
            log(`documentation directory - ${docDir}`);
            makef.createFile(
                fileSet,
                {
                    dir: docDir,
                    logger: {
                        log: log,
                        error: function(message) {
                            log(message, 'error');
                        }
                    }
                }
            );
        }
        else {
            log(`no files are specified as value of "opts.fileSet" inside JSDoc configuration file ${opts.configure}`);
        }
    }
};
