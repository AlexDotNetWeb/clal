import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department, Employee, MainTask } from '../interfaces/tasksModels';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {

  constructor(private http: HttpClient) { }

  getEmployees() {
    return this.http.get<Employee[]>("assets/employees.json");
  }

  getTasks() {
    return this.http.get<MainTask[]>("assets/tasks.json");
  }

  getDepartments() {
    return this.http.get<Department[]>("assets/departments.json");
  }

  listToTree(list:any) {
    var map:any = {}, node, roots = [], i;
    
    for (i = 0; i < list.length; i += 1) {
      map[list[i].DepartmentID] = i; 
      list[i].children = []; 
    }
    
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.ParentID != "0") {
        list[map[node.ParentID]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  checkDatePassedOnTask( tasks:MainTask[] ) {
    for (var i in tasks) {
      if (new Date(tasks[i].DueDate).getTime() < new Date().getTime()) {
        tasks[i].DatePassed = true;
      }
    }
    return tasks;
 }
}
