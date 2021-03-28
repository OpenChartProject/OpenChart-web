export interface TypeConverter<N, T> {
    toNative(data: T): N;
    fromNative(data: N): T;
}
