export type MockedServiceType<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? jest.Mock<ReturnType<T[K]>>
    : T;
};
