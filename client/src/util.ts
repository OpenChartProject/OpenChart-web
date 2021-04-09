// This is convenient for doing deep merges on stores. However using this definitely seems
// to increase the compilation time when running tests.
export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;
