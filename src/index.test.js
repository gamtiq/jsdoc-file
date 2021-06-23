const path = require('path');
const fse = require('makef').fse;
const env = require('jsdoc/lib/jsdoc/env');

jest.mock('jsdoc/lib/jsdoc/util/logger');

const logger = require('jsdoc/lib/jsdoc/util/logger');

const processingComplete = require('./index').handlers.processingComplete;

describe('processingComplete', function processingCompleteSuite() {
    const jsdocOpts = env.opts;
    const testDir = './test-doc';
    const testPath = path.join(__dirname, testDir);
    const docDirLogItem = `documentation directory - ${testPath}`;

    env.pwd = __dirname;
    jsdocOpts.configure = 'jsdoc-conf.json';
    jsdocOpts.destination = testDir;
    
    beforeEach(function before() {
        fse.mkdirSync(testPath);
    });

    afterEach(function after() {
        fse.removeSync(testPath);
        jest.clearAllMocks();
    });

    function stringify(data) {
        return JSON.stringify(data, null, 4);
    }

    function getFileList(dir) {
        return fse.readdirSync(dir || testPath);
    }

    function getFileQty(dir) {
        return getFileList(dir).length;
    }

    function checkFileList(expectedFileSet, dir) {
        const destDir = dir || testPath;
        const fileList = getFileList(destDir);
        let qty = 0;

        for (const fileName in expectedFileSet) {
            expect( fileList[qty] )
                .toBe( fileName );
            const filePath = path.join(destDir, fileName);
            const stat = fse.statSync(filePath);
            if (stat.isDirectory()) {
                checkFileList(expectedFileSet[fileName], filePath);
            }
            else {
                expect( fse.readFileSync(filePath, {encoding: 'utf8'}) )
                    .toBe( expectedFileSet[fileName] );
            }
            qty++;
        }

        expect( fileList.length )
            .toBe( qty );
    }

    function checkLogCall(expectedLog, logLevel) {
        const log = Array.isArray(expectedLog)
            ? expectedLog
            : [expectedLog];
        const logCalls = logger[logLevel || 'info'].mock.calls;
        const logLen = log.length;

        expect( logCalls.length >= logLen )
            .toBe( true );
        for (let i = 0; i < logLen; i++) {
            expect( logCalls[i][0] )
                .toMatch( log[i] );
        }
    }

    it('should not create any file', () => {
        processingComplete();

        expect( getFileQty() )
            .toBe( 0 );

        checkLogCall('no files');
    });

    it('should create single empty file whose name is specified as string value for "opts.fileSet"', () => {
        const fileName = '.nojekyll';
        jsdocOpts.fileSet = fileName;

        processingComplete();

        checkFileList({[fileName]: ''});

        checkLogCall([
            docDirLogItem,
            `file '${path.join(testPath, fileName)}' is created`
        ]);
    });

    it('should overwrite existent file', () => {
        const fileName = 'test-file.txt';
        const content = `content of ${fileName}`;

        fse.outputFileSync(path.join(testPath, fileName), 'some data');

        jsdocOpts.fileSet = {[fileName]: content};

        processingComplete();

        checkFileList({[fileName]: content});

        checkLogCall([
            docDirLogItem,
            `file '${path.join(testPath, fileName)}' is created`
        ]);
    });

    it('should create file and overwrite another existent file', () => {
        const fileName = 'test/file.md';
        const content = `### TOC of ${fileName}`;
        const data = ['some', 5, false, null];

        fse.outputFileSync(path.join(testPath, fileName), 'Markdown');

        jsdocOpts.fileSet = {
            'abc': data,
            [fileName]: content
        };

        processingComplete();

        checkFileList({
            'abc': stringify(data),
            'test': {
                'file.md': content
            }
        });

        checkLogCall([
            docDirLogItem,
            `file '${path.join(testPath, 'abc')}' is created`,
            `file '${path.join(testPath, fileName)}' is created`
        ]);
    });

    it('should not create file because of incorrect name', () => {
        const fileName = 'http://some.where.in.universe/planet/fire';

        jsdocOpts.fileSet = fileName;

        processingComplete();

        checkFileList({});

        checkLogCall(docDirLogItem);
        checkLogCall(`cannot create file '${path.join(testPath, fileName)}'`, 'error');
    });

    it('should create several files', () => {
        const obj = {
            b: {
                c: ['destiny']
            }
        };
        const json = stringify(obj);
        jsdocOpts.fileSet = {
            '.nojekyll': true,
            'a.txt': 38,
            'b/c/d.txt': obj,
            'last-file': 'last line'
        };

        processingComplete();

        checkFileList({
            '.nojekyll': '',
            'a.txt': '38',
            'b': {
                'c': {
                    'd.txt': json
                }
            },
            'last-file': 'last line'
        });
        checkFileList(
            {
                'd.txt': json
            },
            path.join(testPath, 'b/c')
        );

        checkLogCall([
            docDirLogItem,
            `file '${path.join(testPath, '.nojekyll')}' is created`,
            `file '${path.join(testPath, 'a.txt')}' is created`,
            `file '${path.join(testPath, 'b/c/d.txt')}' is created`,
            `file '${path.join(testPath, 'last-file')}' is created`
        ]);
    });

    it('should skip creating some files', () => {
        jsdocOpts.fileSet = {
            'a.txt': false,
            'b/c.md': 'false',
            'end.log': null
        };

        processingComplete();

        checkFileList({
            'b': {
                'c.md': 'false'
            }
        });

        checkLogCall([
            docDirLogItem,
            "skip flag 'false' is set for file 'a.txt'",
            `file '${path.join(testPath, 'b/c.md')}' is created`,
            "skip flag 'null' is set for file 'end.log'"
        ]);
    });
});
