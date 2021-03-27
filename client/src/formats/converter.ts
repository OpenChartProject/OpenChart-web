import { Project } from "../project/project";

export interface IConverter<T> {
    fromNative(project: Project): T;
    toNative(data: T): Project;
}
