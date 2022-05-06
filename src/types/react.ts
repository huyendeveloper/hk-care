export type PickUnion<T> = { [K in keyof T]: Pick<T, K> }[keyof T];

export type MouseEvent<T = HTMLButtonElement> = React.MouseEventHandler<T>;

export type MouseEventCurrying<T = HTMLButtonElement, P = string> = (
  id: P
) => MouseEvent<T>;

export type ChangeEvent<T = HTMLInputElement> = React.ChangeEventHandler<T>;

export type ChangeEventCurrying<T = string> = (id: T) => ChangeEvent;

export type KeyDownEvent<T = HTMLInputElement> = React.KeyboardEventHandler<T>;

export type ClickEvent<T = HTMLButtonElement> = React.MouseEventHandler<T>;

export type ClickEventCurrying<T = HTMLButtonElement, P = number> = (
  id: P
) => ClickEvent<T>;
