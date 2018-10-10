console.log(`javascript being read`);

let employeeArray = [];    //  Array of employees
let totalMonthlyCost = 0;  //  Total monthly cost of employee salaries
let userMessage="Error message not changed";  //  Message to log if input field error

class Employee{
    //  Constructor to use when creating employee objects to put in employeeArray
    constructor(FirstName, LastName, ID, Title, AnnualSalary){
        this.firstName=FirstName;
        this.lastName=LastName;
        this.ID=ID;
        this.title=Title;
        this.annualSalary=AnnualSalary;
    }
}

$(document).ready(readyNow);

function readyNow() {
    //  Event handler for clicking on submit employee button
    $('#submitNewEmployee').on(`click`, addEmployee);
    //  Event handler for clicking on delete employee button
    $('#tableBodyOfEmployees').on(`click`, '.deleteEmployee', deleteEmployee);
}

function addEmployee(){
    //  Function pulls submitted employee stats from entry fields, checks them, clears them, 
    //  uses them to create a new employee object, pushes the employee object to the array, 
    //  recalculates the monthly salary cost and refreshes the employee info and monthly salary cost  
    event.preventDefault();
    let firstNameIn = $(`#FirstName`).val();
    let lastNameIn = $(`#LastName`).val();
    let ID = $(`#ID`).val();
    let titleIn = $(`#Title`).val();
    let annualSalaryIn = $(`#AnnualSalary`).val();
    //  Check input values for errors
    if(!checkTextInput(firstNameIn) || !checkTextInput(lastNameIn) || !checkIDInput(ID) || !checkTextInput(titleIn) || !checkAnnualSalaryInput(annualSalaryIn)){
        alert(userMessage);
        return;
    }

    $('input').val('');       //  Empty input fields for next entry

    let newEmployee = new Employee(firstNameIn, lastNameIn, ID, titleIn, annualSalaryIn);
    employeeArray.push(newEmployee);
    refreshEmployeeTable();
    updateTotalMonthlyCost(newEmployee, true);  //  True indicates to add to TotalMonthlyCost
}

function checkTextInput(input){  //  Make sure text fields filled in
    if(input == ""){userMessage = "Empty Text Field"; return false;}
    return true;
}
function checkIDInput(input){  //  Make sure no duplicate or negative IDs and field filled
    for(employee of employeeArray){
        if(input === employee.ID){userMessage = "Employee ID already exists"; return false;}
    }
    if(input<0){userMessage = "ID cannot be negative number"; return false;}
    if(input.length === 0){userMessage = "Employee ID not entered"; return false;}
    return true;

}function checkAnnualSalaryInput(input){  //  Make sure annual salary field is not negative and filled
    if(input<0){userMessage = "Annual Salary cannot be negative number"; return false;}
    if(input.length === 0){userMessage = "Annual Salary not entered"; return false;}
    return true;
}


function deleteEmployee(){
    //  Function checks the htmlElementTagNumber of the clicked button's row on the table
    //  which is always the associated employees index in the array and uses is to update 
    //  totalmonthlycost, splice the associated employee out of employeeArray then refreshes
    //  the table

    let htmlElementTagNumber = $(this).parent().parent().data("htmlElementTagNumber");  //Grabbing the tag number of the delete buton's row
    updateTotalMonthlyCost(employeeArray[htmlElementTagNumber], false);           //  false indicates to reduce TotalMonthlyCost
    employeeArray.splice(htmlElementTagNumber, 1);
    refreshEmployeeTable();
}

function refreshEmployeeTable(){
    //  Clears the employee table elements and then recreates the table from the 
    //  recently updated employeeArray
    let tableBodyOfEmployees = $("#tableBodyOfEmployees");
    tableBodyOfEmployees.empty();  //  The current table is removed 
    let i=0; 
    for(let employee of employeeArray){
        //  This loop reinserts all employees from employeeArray into the table
        //  Each table row is ID'd with the index of it's associated employee
        //  and a delete button is added to the last column

        tableBodyOfEmployees.append(`<tr id=` + i + `>  
        <td>` + employee.firstName + `</td>
        <td>` + employee.lastName + `</td>
        <td>` + employee.ID + `</td>
        <td>` + employee.title + `</td>
        <td>` + employee.annualSalary + `</td>
        <td><button class="deleteEmployee">Delete Employee</button> </td>
        </tr>`);
        
        let hashStringi = "#" + i.toString();  // i is converted to the string '#i' due to jquery 
        $(hashStringi).data("htmlElementTagNumber", i);     // jquery gives the new row (<tr>) a "tag number" i.
                                                            // each <tr> element's "tag number" matches the
                                                            // associated employee's index in employeeArray
        
        if( i % 2  === 0 ){
            $(hashStringi).toggleClass('aliceblue');
        }
        if( i % 2  === 1 ){
            $(hashStringi).toggleClass('white');
        }
        i++;
    }

}

function updateTotalMonthlyCost(employee, boolean){
    //  This function adds to the monthly cost when an employee is added
    //  or subtracts from the monthly cost when an employee is deleted
    //  then updates the table
    if(boolean === true){  
        if(totalMonthlyCost <= 20000 && totalMonthlyCost + employee.annualSalary/12 > 20000){
            //  If we went from under 20000 per month to over 2000 per month, toggle the class to red and notify user
            $('#totalMonthlyCost').toggleClass('inTheRed');
            alert('You have exceeded your total monthly cost');
        }
        totalMonthlyCost += employee.annualSalary/12;
        
        
    }
    else if(boolean === false){
        if(totalMonthlyCost > 20000 && totalMonthlyCost - employee.annualSalary/12 <= 20000){
            //  If we went from over 2000 to under 20000 per month toggle the class to not red
            $('#totalMonthlyCost').toggleClass('inTheRed');
        }
        totalMonthlyCost = totalMonthlyCost - employee.annualSalary/12;
    }

    //  Convert totalMonthlyCost to two decimal places

    totalMonthlyCost = parseFloat(totalMonthlyCost.toFixed(2));
    if(totalMonthlyCost<0){totalMonthlyCost = 0}
     
    //  Update the totalMonthlyCostElement on the website
    let totalMonthlyCostElement = $('#totalMonthlyCost');
    totalMonthlyCostElement.empty();
    totalMonthlyCostElement.append(`<h2 id="totalMonthlyCost" >Total Monthly: $` + totalMonthlyCost + `</p>`)

}
