import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { Department, DepTree, Employee, MainTask } from 'src/app/interfaces/tasksModels';
import { BackendApiService } from 'src/app/services/backend-api.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less']
})
export class TasksComponent implements OnInit, AfterViewInit {
  EmployeeOrDepName:string="";
  employees :Employee[] = [];
  departments:Department[]=[];
  departmentSelected:Department={} as Department;
  public tasks :MainTask[] = [];
  employeeSelected :Employee = {} as Employee;
  displayedColumns: string[] = ['TaskNumber', 'TaskName', 'EmployeeName', 'DepartmentID','DueDate'];
  dataSourceTable = new MatTableDataSource<MainTask>();
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  private _transformer = (node: DepTree, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.DepartmentName,
      level: level,
      DepartmentID:node.DepartmentID,
      ParentID:node.ParentID
    };
  };

  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSourceTree = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  public fixedTaskName: boolean = false;

  @HostListener('window:scroll', [])
    onWindowScroll() {
        let number = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
        if (number > 100) {
            this.fixedTaskName = true;
        } else if (this.fixedTaskName && number < 10) {
            this.fixedTaskName = false;
        }
    }

  constructor(public backendApi:BackendApiService,@Inject(DOCUMENT) private doc: Document) { }

  ngOnInit(): void {
    this.onWindowScroll();

    this.backendApi.getEmployees().subscribe(data=>{
      if(data){
        this.employees=data;
      }
      else{
        //todo error
      }
    })

    this.backendApi.getDepartments().subscribe(data=>{
      if(data){
        this.departments=data;
        console.log(this.backendApi.listToTree(data))
        this.dataSourceTree.data = this.backendApi.listToTree(data);
      }
      else{
        //todo error
      }
    })

  }

  onDepartentChoose(departmentChoosen:Department){
    this.departmentSelected = departmentChoosen;
    this.EmployeeOrDepName = departmentChoosen.DepartmentName;
    this.getTasks("",departmentChoosen.DepartmentID)
  }

  ngAfterViewInit() {
    
  }

  getTasks(employee:string,depId:number){
    if(employee!=""||depId!=0 && employee!=undefined && depId!=undefined){
      this.backendApi.getTasks().subscribe(data=>{
        if(data){
          if(employee!="")
             this.tasks = data.filter(x=>x.EmployeeName==employee);
          else
             this.tasks = data.filter(x=> x.DepartmentID == depId);
          this.tasks = this.tasks.sort((a, b) => {
            return <any>new Date(a.DueDate) - <any>new Date(b.DueDate);
          });
          this.tasks =  this.backendApi.checkDatePassedOnTask(this.tasks);
          this.dataSourceTable.data = this.tasks;
          this.dataSourceTable.paginator = this.paginator;
        }
        else{
          //todo error
        }
      })
    }
    else{
      //todo error no tasks found
    }
  }

 

  onEmployeeChange(event:any){
    this.getTasks(event.value,0)
  }
}
