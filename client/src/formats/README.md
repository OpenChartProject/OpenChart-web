Importing and exporting of different file formats is handled as a two-step process.

Each file format has an intermediate data structure, usually called `FileData`. The `FileData` object is simply used for storing the file's contents as native JS types.

For imports:

1. The file's contents are deserialized from a string into a `FileData` object
2. The `FileData` object is converted into a native `Project` object

For exports:

1. The native `Project` object is converted into a `FileData` object
2. The `FileData` object is serialized into a string

Using a two-step process for this makes debugging easier since we can isolate and test each step individually. It also promotes keeping the code organized which is useful in cases where the structure of the `FileData` object is vastly different than the `Project` object.
