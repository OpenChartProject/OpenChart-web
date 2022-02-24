export interface ISerializer<T> {
    read(contents: string): T;
    write(data: T): string;
}
