class SavesHandler {
    protected static _instance: SavesHandler;

    protected constructor() {}

    public static instance(): SavesHandler {
        if (!SavesHandler._instance) {
            SavesHandler._instance = new SavesHandler();
        }

        return SavesHandler._instance;
    }

    public saveData(key: string, data: any): void {
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    public loadData(key: string): any {
        return JSON.parse(sessionStorage.getItem(key));
    }

    public saveDataLongTerm(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public loadDataLongTerm(key: string): any {
        return JSON.parse(localStorage.getItem(key));
    }

}

export { SavesHandler }