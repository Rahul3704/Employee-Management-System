const empForm = document.getElementById('empForm');
const empTableBody = document.querySelector('#empTable tbody');
const statsContent = document.getElementById('statsContent');

const clearForm = () => {
    empForm.reset();
    document.getElementById('empId').value = '';
    document.getElementById('saveBtn').textContent = 'Save';
};

const fetchEmployees = async () => {
    try {
        const res = await fetch('/api/employees');
        if (!res.ok) throw new Error("Failed to fetch employees");
        const employees = await res.json();

        empTableBody.innerHTML = '';
        employees.forEach(emp => {
            const row = empTableBody.insertRow();
            row.insertCell().textContent = emp.id;
            row.insertCell().textContent = emp.name;
            row.insertCell().textContent = emp.department;
            row.insertCell().textContent = emp.designation;
            row.insertCell().textContent = parseFloat(emp.salary).toFixed(2);
            row.insertCell().textContent = emp.joining_date;
            row.insertCell().textContent = emp.email;

            const actionsCell = row.insertCell();
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => loadEmployeeForEdit(emp.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteEmployee(emp.id);

            actionsCell.append(editBtn, deleteBtn);
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
};

const fetchStats = async () => {
    statsContent.innerHTML = 'Loading...';
    try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error("Failed to fetch statistics");
        const stats = await res.json();

        let deptList = '';
        for (const [dept, count] of Object.entries(stats.departmentWise || {})) {
            deptList += `<li>${dept}: ${count}</li>`;
        }

        statsContent.innerHTML = `
            <p>Total Employees: ${stats.total}</p>
            <p>Average Salary: $${stats.avgSalary ? stats.avgSalary.toFixed(2) : '0.00'}</p>
            <p>Max Salary: $${stats.maxSalary ? stats.maxSalary.toFixed(2) : '0.00'}</p>
            <p>Min Salary: $${stats.minSalary ? stats.minSalary.toFixed(2) : '0.00'}</p>
            <h4>Employees by Department:</h4>
            <ul>${deptList}</ul>
        `;
    } catch (error) {
        statsContent.innerHTML = 'Failed to load statistics.';
        console.error("Error fetching stats:", error);
    }
};

const loadEmployeeForEdit = async (id) => {
    try {
        const res = await fetch(`/api/employees/${id}`);
        if (!res.ok) throw new Error("Employee not found");
        const emp = await res.json();

        document.getElementById('empId').value = emp.id;
        document.getElementById('name').value = emp.name;
        document.getElementById('department').value = emp.department;
        document.getElementById('designation').value = emp.designation;
        document.getElementById('salary').value = emp.salary;
        document.getElementById('joining_date').value = emp.joining_date;
        document.getElementById('email').value = emp.email;

        document.getElementById('saveBtn').textContent = 'Update';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        alert(`Failed to load employee: ${error.message}`);
    }
};

const deleteEmployee = async (id) => {
    if (!confirm(`Are you sure you want to delete employee ID ${id}?`)) return;

    try {
        const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to delete employee");

        alert("Employee deleted successfully!");
        fetchEmployees();
        fetchStats();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Login Status
    const res = await fetch('/api/me');
    if (!res.ok) {
        location.href = '/login.html';
        return;
    }

    // 2. Form Submission Handler
    empForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('empId').value;
        const url = id ? `/api/employees/${id}` : '/api/employees';
        const method = id ? 'PUT' : 'POST';

        const formData = {
            name: document.getElementById('name').value.trim(),
            department: document.getElementById('department').value.trim(),
            designation: document.getElementById('designation').value.trim(),
            salary: parseFloat(document.getElementById('salary').value) || 0, 
            joining_date: document.getElementById('joining_date').value.trim(),
            email: document.getElementById('email').value.trim()
        };

        try {
            const saveRes = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await saveRes.json();

            if (saveRes.ok) {
                alert(`Employee ${id ? 'updated' : 'added'} successfully!`);
                clearForm();
                fetchEmployees();
                fetchStats();
            } else {
                alert(`Error: ${result.error || 'Failed to save employee'}`);
            }
        } catch (error) {
            console.error("Fetch error during save:", error);
            alert("A network error occurred while saving.");
        }
    });

    document.getElementById('clearBtn').addEventListener('click', clearForm);

    fetchEmployees();
    fetchStats();

    document.getElementById('exportBtn').addEventListener('click', () => {
        window.location.href = '/api/export/csv';
    });

    document.getElementById('refreshBtn').addEventListener('click', () => {
        fetchEmployees();
        fetchStats();
    });
});
