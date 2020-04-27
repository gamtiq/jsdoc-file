# jsdoc-file <a name="start"></a>

[JSDoc](https://jsdoc.app/) plugin to create files inside directory of generated documentation (e.g. `.nojekyll` etc).

## Table of contents

* [Installation](#install)
* [Usage](#usage)
* [Examples](#examples)
* [Contributing](#contributing)
* [License](#license)

## Installation <a name="install"></a> [&#x2191;](#start)

    npm install jsdoc-file --save-dev

This plugin requires the following:
* Node.js version >= 6.4
* JSDoc version >= 3.2.1

## Usage <a name="usage"></a> [&#x2191;](#start)

1. Add plugin into `plugins` array of a [JSDoc configuration file](https://jsdoc.app/about-configuring-jsdoc.html#configuring-plugins):

```json
{
    ...
    "plugins": [
        ...
        "jsdoc-file"
    ],
    ...
}
```

2. Specify files that should be created as value of `opts.fileSet` field in the [JSDoc configuration file](https://jsdoc.app/about-configuring-jsdoc.html#incorporating-command-line-options-into-the-configuration-file):

```json
{
    "opts": {
        ...
        "fileSet": {
            ".nojekyll": "",
            "LICENSE-MIT": "Copyright (c) ..."
        }
    },
    ...
}
```

You can specify one or several files and provide content for them.  
If a file does already exist in documentation directory the file will be overwritten.  
It is possible to set file path that includes subdirectories inside documentation directory (necessary subdirectories will be automatically created).  
You can skip creation of a file by setting `false`/`null` value for the file.  
If you set an object or an array as a value for a file the corresponding JSON will be written into the file.  
See examples below.

## Examples <a name="examples"></a> [&#x2191;](#start)

In the following examples `"opts": {...}` is omitted for brevity.

Create one empty file:
```json
"fileSet": ".nojekyll"
```
or
```json
"fileSet":  {
    ".nojekyll": ""
}
```
or
```json
"fileSet":  {
    ".nojekyll": true
}
```

Create several files at once:
```json
"fileSet":  {
    ".nojekyll": true,
    "LICENSE": "Some license data here",
    "very/important/file.txt": "very important data",
    "config.json": {
        "a": 2,
        "topics": ["home", "docs"],
        "url": "http://some.server.net"
    }
}
```

Skip creating some files by setting `false`/`null` value for them:
```json
"fileSet":  {
    ".nojekyll": false,
    "a.txt": "content",
    "some/dir/file.md": null
}
```

## Contributing <a name="contributing"></a> [&#x2191;](#start)
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code.

## License <a name="license"></a> [&#x2191;](#start)
Copyright (c) 2020 Denis Sikuler  
Licensed under the MIT license.
