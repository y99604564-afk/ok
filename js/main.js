let students = [];
let studentId = 1;

class Student {
    #grades;
    #attendance;

    constructor(id, name, grades, attendance) {
        this.id = id;
        this.name = name;
        this.grades = grades;
        this.attendance = attendance;
        this.mercyApplied = [false, false, false];
    }

    set grades(value) {
        if (!Array.isArray(value) || value.length !== 3) {
            throw new Error("يجب إدخال درجات ثلاث مواد");
        }

        if (value.some(g => !Number.isFinite(g) || g < 0 || g > 100)) {
            throw new Error("الدرجات يجب أن تكون من 0 إلى 100");
        }

        this.#grades = value;
    }

    get grades() {
        return this.#grades;
    }

    set attendance(value) {
        if (!Number.isFinite(value) || value < 0 || value > 100) {
            throw new Error("نسبة الحضور يجب أن تكون من 0 إلى 100");
        }

        this.#attendance = value;
    }

    get attendance() {
        return this.#attendance;
    }

    getAverage() {
        let total = this.#grades.reduce((sum, grade) => sum + grade, 0);
        return (total / 3).toFixed(2);
    }

    getGrade() {
        let average = Number(this.getAverage());

        if (average >= 90) return "A";
        if (average >= 80) return "B";
        if (average >= 70) return "C";
        if (average >= 60) return "D";
        if (average >= 50) return "E";

        return "F";
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const studentName = document.getElementById("studentName");
    const grade1 = document.getElementById("grade1");
    const grade2 = document.getElementById("grade2");
    const grade3 = document.getElementById("grade3");
    const attendance = document.getElementById("attendance");

    const addStudent = document.getElementById("addStudent");
    const mercyCommittee = document.getElementById("mercyCommittee");

    const errorBox = document.getElementById("errorBox");
    const studentsDisplay = document.getElementById("studentsDisplay");
    const reportDisplay = document.getElementById("reportDisplay");

    if (
        !studentName || !grade1 || !grade2 || !grade3 ||
        !attendance || !addStudent || !mercyCommittee ||
        !errorBox || !studentsDisplay || !reportDisplay
    ) {
        console.error("يوجد عنصر HTML ناقص أو اسمه غير مطابق");
        return;
    }

    // إضافة طالب
    addStudent.addEventListener("click", function () {

        try {
            const name = studentName.value.trim();

            if (
                name === "" ||
                grade1.value.trim() === "" ||
                grade2.value.trim() === "" ||
                grade3.value.trim() === "" ||
                attendance.value.trim() === ""
            ) {
                throw new Error("من فضلك أدخل جميع البيانات");
            }

            const grades = [
                Number(grade1.value),
                Number(grade2.value),
                Number(grade3.value)
            ];

            const studentAttendance = Number(attendance.value);

            const student = new Student(
                studentId,
                name,
                grades,
                studentAttendance
            );

            students.push(student);
            studentId++;

            displayStudents();

            studentName.value = "";
            grade1.value = "";
            grade2.value = "";
            grade3.value = "";
            attendance.value = "";

            errorBox.textContent = "";

        } catch (error) {
            errorBox.textContent = error.message;
        }
    });

    // عرض الطلاب
    function displayStudents() {

        if (students.length === 0) {
            studentsDisplay.innerHTML = "لا يوجد طلاب مضافون";
            return;
        }

        studentsDisplay.innerHTML = students.map(student => `
            <div class="student-card">
                <h3>اسم الطالب: ${student.name}</h3>
                <p>الرقم: ${student.id}</p>
                <p>المادة الأولى: ${student.grades[0]}</p>
                <p>المادة الثانية: ${student.grades[1]}</p>
                <p>المادة الثالثة: ${student.grades[2]}</p>
                <p>نسبة الحضور: ${student.attendance}%</p>
                <p>المتوسط: ${student.getAverage()}</p>
                <p>التقدير: ${student.getGrade()}</p>
            </div>
        `).join("");
    }

    // لجنة الرأفة
    mercyCommittee.addEventListener("click", function () {

        if (students.length === 0) {
            reportDisplay.textContent = "لا يوجد طلاب مسجلون";
            return;
        }

        const subjects = [
            "المادة الأولى",
            "المادة الثانية",
            "المادة الثالثة"
        ];

        let mercyResults = [];

        students.forEach(student => {

            student.grades.forEach((grade, index) => {

                if (
                    grade >= 40 &&
                    grade < 50 &&
                    student.mercyApplied[index] === false
                ) {

                    const newGrade = grade + 5;

                    student.grades[index] = newGrade;
                    student.mercyApplied[index] = true;

                    mercyResults.push(`
                        <div class="mercy-card">
                            <h4>اسم الطالب: ${student.name}</h4>
                            <p>المادة: ${subjects[index]}</p>
                            <p>الدرجة قبل الرأفة: ${grade}</p>
                            <p>درجات الرأفة المضافة: 5 درجات</p>
                            <p>الدرجة بعد الرأفة: ${newGrade}</p>
                        </div>
                    `);
                }

            });
        });

        if (mercyResults.length === 0) {
            reportDisplay.textContent =
                "لا يوجد طلاب مستحقون لدرجات الرأفة";
        } else {
            reportDisplay.innerHTML = `
                <h3>التقرير النهائي للجنة الرأفة</h3>
                ${mercyResults.join("")}
            `;
        }

        displayStudents();
    });

});