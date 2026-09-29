let openModal = document.getElementById("openModal");
let outerModal = document.getElementById("outerModal");
let innerModal = document.getElementById("innerModal");
let showStudents = document.getElementById("showStudents");
let studentsBase = localStorage.getItem("studentInfo");
let base = studentsBase ? JSON.parse(studentsBase) : [];
localStorage.setItem("studentInfo", JSON.stringify(base));
let firstnameInput = document.getElementById("firstnameInput");
let lastnameInput = document.getElementById("lastnameInput");
let selectGroup = document.getElementById("selectGroup");
let isWorkInput = document.getElementById("isWorkInput");
let searchInput = document.getElementById("search");
let headerSelect = document.getElementById("headerSelect");
let editingStudentId = null;

function renderStudents(content, data){
    if (content) {
        content.innerHTML = "";
    }
    data?.forEach((el) => {
        if (content) {
            content.innerHTML += `
            <tr class="bg-neutral-primary border-b border-default">
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    ${el.firstName}
                </th>
                <td class="px-6 py-4">
                    ${el.lastName}
                </td>
                <td class="px-6 py-4">
                    ${el.group}
                </td>
                <td class="px-6 py-4">
                    ${(el.work ?? el.isWork) ? "Yes" : "No"}
                </td>
                <td class="px-6 py-4">
                    <button onClick="editStudent(${el.id})" class="p-5 bg-[green] text-[white]">Edit</button>
                    <button onClick="deleteStudent(${el.id})" class="p-5 bg-[red] text-[white]">Delete</button>
                </td>
            </tr>
            `;
        }
    });
}

renderStudents(showStudents, base);

if (openModal) {
    openModal.addEventListener("click", function(){
        editingStudentId = null;
        innerModal.reset();
        outerModal.classList.remove("hidden");
    });
}

if (outerModal) {
    outerModal.addEventListener("click", function(){
        editingStudentId = null;
        innerModal.reset();
        outerModal.classList.add("hidden");
    });
}

if (innerModal) {
    innerModal.addEventListener("click", function(e){
        e.stopPropagation();
    });

    innerModal.addEventListener("submit", function(e){
        e.preventDefault();
        if (editingStudentId !== null) {
            let student = base.find(el => el.id === editingStudentId);
            if (student) {
                student.firstName = e.target[0].value;
                student.lastName = e.target[1].value;
                student.group = e.target[2].value;
                student.work = e.target[3].checked;
            }
            editingStudentId = null;
        } else {
            let studentInfo = {
                id: Date.now(),
                firstName: e.target[0].value,
                lastName: e.target[1].value,
                group: e.target[2].value,
                work: e.target[3].checked
            };
            base.push(studentInfo);
        }
        localStorage.setItem("studentInfo", JSON.stringify(base));
        outerModal.classList.add("hidden");
        innerModal.reset();
        renderStudents(showStudents, base);
    });
}

function editStudent(id){
    editingStudentId = id;
    outerModal.classList.remove("hidden");
    let student = base?.find(el => el.id === id);
    if (!student) return;
    firstnameInput.value = student.firstName;
    lastnameInput.value = student.lastName;
    selectGroup.value = student.group;
    isWorkInput.checked = student.work ?? student.isWork ?? false;
}

function deleteStudent(id){
    base = base.filter(el => el.id !== id);
    localStorage.setItem("studentInfo", JSON.stringify(base));
    renderStudents(showStudents, base);
}

headerSelect.addEventListener("click", function(e){
    let filteredValue = e.target.value;
    if (filteredValue === "All") {
        filtered = base   
    }else{
        filtered = base.filter((el) => el.group === filteredValue)
    }
    renderStudents(showStudents, filtered);
})
    

function searchStudents(content, data){
    if (!content) return;
    content.innerHTML = "";
    if (!Array.isArray(data)) return;
    data.forEach((el) => {
        content.innerHTML += `
        <tr class="bg-neutral-primary border-b border-default">
            <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                ${el.firstName}
            </th>
            <td class="px-6 py-4">
                ${el.lastName}
            </td>
            <td class="px-6 py-4">
                ${el.group}
            </td>
            <td class="px-6 py-4">
                ${(el.work ?? el.isWork) ? "Yes" : "No"}
            </td>
            <td class="px-6 py-4">
                <button onClick="editStudent(${el.id})" class="p-5 bg-[green] text-[white]">Edit</button>
                <button onClick="deleteStudent(${el.id})" class="p-5 bg-[red] text-[white]">Delete</button>
            </td>
        </tr>
        `;
    });
}

if (searchInput) {
    searchInput.addEventListener("input", function (e) {
        let searchValue = e.target.value.toLowerCase().trim();
        let filteredStudents = base.filter(el =>
            el.firstName.toLowerCase().includes(searchValue) ||
            el.lastName.toLowerCase().includes(searchValue)
        );
        searchStudents(showStudents, filteredStudents);
    });
}