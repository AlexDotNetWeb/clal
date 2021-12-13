export interface Employee{
    EmployeeName: string;
    EmployeePicture: string;
}

export interface Department{
    DepartmentID:number;
    DepartmentName:string;
    ParentID:number;
}

export interface MainTask{
    TaskNumber:number;
    TaskName:string;
    StatusID:number;
    EmployeeName:string;
    DepartmentID:1;
    DueDate:Date;
    DatePassed:boolean;
}

export interface DepTree{
    DepartmentID: number;
DepartmentName: string;
ParentID: number;
children: [];
}