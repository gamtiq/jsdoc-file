const path = require('path');

const fse = require('fs-extra');
const env = require('jsdoc/lib/jsdoc/env');
const logger = require('jsdoc/lib/jsdoc/util/logger');

const packageName = require('../package.json').name;

function log(message, level) {
    logger[level || 'info'](`${packageName}: ${message}`);
}

exports.handlers = {
    processingComplete: function processingComplete() {
        const opts = env.opts;
        let fileSet = opts.fileSet;
        const fileType = typeof fileSet;

        if (fileSet && (fileType === 'string' || fileType === 'object')) {
            const docDir = path.join(env.pwd, opts.destination);
            log(`documentation directory - ${docDir}`);
            if (fileType === 'string') {
                fileSet = {[fileSet]: ''};
            }
            for (let fileName in fileSet) {
                let content = fileSet[fileName];
                // eslint-disable-next-line eqeqeq, no-eq-null
                if (content === false || content == null) {
                    log(`skip flag '${content}' is set for file '${fileName}' so it is not created`);
                }
                else {
                    if (content === true) {
                        content = '';
                    }
                    else if (typeof content === 'object') {
                        content = JSON.stringify(content, null, 4);
                    }
                    else {
                        content = String(content);
                    }
                    fileName = path.join(docDir, fileName);
                    try {
                        fse.outputFileSync(fileName, content);
                        log(`file '${fileName}' is created`);
                    }
                    catch (e) {
                        log(`cannot create file '${fileName}'; error details -\n${e}`, 'error');
                    }
                }
            }
        }
        else {
            log(`no files are specified as value of "opts.fileSet" inside JSDoc configuration file ${opts.configure}`);
        }
    }
};
