

export interface IDbConnection {

    connection: () => Promise<void>;

}