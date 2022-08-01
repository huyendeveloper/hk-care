export enum IsDelete{
    Active = 0,
    Deleted = 1
}

export class TableDelete{
   public static readonly Active = false;
   public static readonly Deleted = true;
}

export class TableActive{
    public static readonly Active = true;
    public static readonly Deleted = false;
 }