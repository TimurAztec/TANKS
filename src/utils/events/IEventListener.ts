export interface IEventListener {
    onEvent(event: string, data: any): void;
}