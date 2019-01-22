import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/employee.model';
import { Chart } from 'chart.js';

declare var M: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService]
})
export class EmployeeComponent implements OnInit {

  constructor(private employeeService: EmployeeService) { }
  chart = [];
  searchResults: any;
  elastic = false;
  salary = [];
  count = [];
  response: any;

  ngOnInit() {
    this.resetForm();
    this.refreshEmployeeList();
    this.renderChart();

    this.employeeService.chartData().subscribe( res => {
      this.response = res;
      const data = this.response.aggregations.price_ranges.buckets;
      for (let i = 0 ; i < data.length ; i++) {
          this.salary.push(data[i].key);
          this.count.push(data[i].doc_count);
      }

  }
    );
  }

renderChart() {

  this.chart = new Chart('barChart', {
    type: 'bar',
    data: {
    labels: this.salary, // your labels array
    datasets: [
      {
        label: '# user count',
        data: this.count, // your data array
        backgroundColor: [
         'rgba(54, 162, 235, 1)',
         'rgba(255, 99, 132, 1)',
         'rgba(255, 206, 86, 1)',
         'rgba(75, 192, 192, 1)',
         'rgba(153, 102, 255, 1)',
         'rgba(230, 25, 75, 1)',
         'rgba(60, 180, 75, 1)',
         'rgba(245, 130, 48, 1)',
         'rgba(145, 30, 180, 1)',
         'rgba(210, 245, 60, 1)',
         'rgba(0, 128, 128, 1)',
         'rgba(128, 0, 0, 1)'

        ],
        fill: false,
        lineTension: 0.2,
        borderWidth: 1
      }
    ]
    },
    options: {
      responsive: true,
      title: {
      text: 'Salary vs No. of people',
      display: true
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

  search(e: any) {
    this.employeeService.getSearchResults(e.target.value).subscribe((res) => {
      this.searchResults = res;
      // console.log(res);
    });

    this.elastic = true;
    if (e.target.value === '') {
    this.elastic = false;

    }
  }

  resetForm(form?: NgForm) {
  //   if (form){
  //     form.reset();
  // }
  this.renderChart();
    this.employeeService.selectedEmployee = {
      _id: '',
      name: '',
      position: '',
      office: '',
      salary: null
    };
  }

  onSubmit(form: NgForm) {
    if (form.value._id === '') {
      this.employeeService.postEmployee(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        this.renderChart();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    } else {
      this.employeeService.putEmployee(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        this.renderChart();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  refreshEmployeeList() {
    this.employeeService.getEmployeeList().subscribe((res) => {
      this.employeeService.employees = res as Employee[];
    });
    this.elastic = false;
  }

  onEdit(emp: Employee) {
    this.employeeService.selectedEmployee = emp;
  }

  onDelete(_id: string, form: NgForm) {
    if (confirm('Are you sure to delete this record ?') === true) {
      this.employeeService.deleteEmployee(_id).subscribe((res) => {
        this.refreshEmployeeList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }

}
