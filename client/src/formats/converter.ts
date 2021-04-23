import { Project } from "../project";

export interface IConverter<T> {
    fromNative(project: Project): T;
    toNative(data: T): Project;
}

export interface TypeConverter<N, T> {
    toNative(data: T): N;
    fromNative(data: N): T;
}
