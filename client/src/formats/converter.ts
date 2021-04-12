import { Project } from "../project";

export interface IConverter<T> {
    fromNative(project: Project): T;
    toNative(data: T): Project;
}
