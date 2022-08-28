
class SavesHandler {

    protected constructor() {}

    public static saveData(key: string, data: any): void {
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    public static loadData(key: string): any {
        return JSON.parse(sessionStorage.getItem(key));
    }

    public static saveDataLongTerm(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public static loadDataLongTerm(key: string): any {
        return JSON.parse(localStorage.getItem(key));
    }

}

export { SavesHandler }