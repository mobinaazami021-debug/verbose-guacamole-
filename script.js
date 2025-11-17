function openTab(tabName) {
    console.log('Opening tab:', tabName);
    
    // مخفی کردن تمام تب‌ها
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    // غیرفعال کردن تمام دکمه‌ها
    const tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // نمایش تب انتخاب شده و فعال کردن دکمه
    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");

    // اگر تب مثلث‌ساز باز شد، مثلث را رسم کن
    if (tabName === 'tab-play') {
        setTimeout(drawTriangle, 100);
    }
    // اگر تب آزمون باز شد، سوال جدید بده
    if (tabName === 'tab-quiz') {
        setTimeout(loadNewQuestion, 100);
    }
}

// مثلث‌ساز پویا
function drawTriangle() {
    console.log('Drawing triangle...');
    const canvas = document.getElementById('triangleCanvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const resultDiv = document.getElementById('congruenceResult');

    // پاک کردن کانواس
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // گرفتن مقادیر از ورودی‌ها
    const sideAB = parseFloat(document.getElementById('sideAB').value) || 5;
    const angleA = parseFloat(document.getElementById('angleA').value) || 60;
    const sideAC = parseFloat(document.getElementById('sideAC').value) || 5;

    // تبدیل زاویه به رادیان
    const angleARad = angleA * Math.PI / 180;

    // مختصات نقاط
    const pointA = { x: 100, y: 200 };
    const pointB = { x: pointA.x + sideAB * 20, y: pointA.y };
    const pointC = {
        x: pointA.x + sideAC * 20 * Math.cos(angleARad),
        y: pointA.y - sideAC * 20 * Math.sin(angleARad)
    };

    // رسم مثلث
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.lineTo(pointC.x, pointC.y);
    ctx.closePath();
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2;
    ctx.stroke();

    // پر کردن مثلث با رنگ روشن
    ctx.fillStyle = 'rgba(46, 125, 50, 0.1)';
    ctx.fill();

    // رسم نقاط
    ctx.fillStyle = 'red';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    ctx.beginPath();
    ctx.arc(pointA.x, pointA.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('A', pointA.x - 15, pointA.y + 15);

    ctx.beginPath();
    ctx.arc(pointB.x, pointB.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('B', pointB.x + 5, pointB.y + 15);

    ctx.beginPath();
    ctx.arc(pointC.x, pointC.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('C', pointC.x - 10, pointC.y - 10);

    // بررسی هم‌نهشتی با یک مثلث نمونه
    const sampleSide1 = 5;
    const sampleAngle = 60;
    const sampleSide2 = 5;

    if (sideAB === sampleSide1 && sideAC === sampleSide2 && angleA === sampleAngle) {
        resultDiv.innerHTML = "<p style='color: green;'>آفرین! مثلث شما با مثلث نمونه هم‌نهشت است (حالت ض ز ض).</p>";
    } else {
        resultDiv.innerHTML = "<p style='color: red;'>مثلث شما با مثلث نمونه هم‌نهشت نیست. مقادیر را تغییر دهید و دوباره امتحان کنید!</p>";
    }
}

// سیستم آزمون
let currentQuestion = {};
let userAnswer = null;

const questions = [
    {
        question: "اگر دو مثلث دارای سه زاویه مساوی باشند، آیا حتماً هم‌نهشت هستند؟",
        options: ["بله، همیشه", "خیر، فقط اگر یک ضلع مساوی هم داشته باشند", "خیر، هرگز"],
        correct: 1
    },
    {
        question: "کدام حالت برای اثبات هم‌نهشتی مثلث‌ها کافی است؟",
        options: ["دو ضلع مساوی", "دو زاویه مساوی", "دو ضلع و زاویه بین آن‌ها"],
        correct: 2
    },
    {
        question: "اگر دو مثلث دارای سه ضلع مساوی باشند، کدام حالت هم‌نهشتی را اثبات می‌کند؟",
        options: ["ض ز ض", "ز ض ز", "ض ض ض"],
        correct: 2
    }
];

function loadNewQuestion() {
    console.log('Loading new question...');
    // انتخاب یک سوال تصادفی
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];
    
    const questionDiv = document.getElementById('question');
    const optionsDiv = document.getElementById('options');
    const resultDiv = document.getElementById('quizResult');
    
    if (!questionDiv) {
        console.error('Question div not found!');
        return;
    }
    
    // پاک کردن نتیجه قبلی
    resultDiv.innerHTML = '';
    
    // نمایش سوال
    questionDiv.innerHTML = <h3>${currentQuestion.question}</h3>;
    
    // نمایش گزینه‌ها
    optionsDiv.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = option;
        optionElement.onclick = function() {
            // حذف انتخاب قبلی
            const allOptions = document.getElementsByClassName('option');
            for (let i = 0; i < allOptions.length; i++) {
                allOptions[i].style.backgroundColor = '#e8f5e9';
            }
            
            // انتخاب گزینه جدید
            this.style.backgroundColor = '#c8e6c9';
            userAnswer = index;
        };
        optionsDiv.appendChild(optionElement);
    });
}

function checkAnswer() {
    console.log('Checking answer...');
    const resultDiv = document.getElementById('quizResult');
    
    if (userAnswer === null) {
        resultDiv.innerHTML = "<p style='color: orange;'>لطفاً یک گزینه انتخاب کنید!</p>";
        return;
    }
    
    if (userAnswer === currentQuestion.correct) {
        resultDiv.innerHTML = "<p style='color: green;'>✅ پاسخ شما صحیح است! آفرین!</p>";
    } else {
        resultDiv.innerHTML = <p style='color: red;'>❌ متأسفانه پاسخ صحیح نبود. پاسخ صحیح: ${currentQuestion.options[currentQuestion.correct]}</p>;
    }
    
    // پس از 3 ثانیه سوال جدید بارگذاری شود
    setTimeout(loadNewQuestion, 3000);
}

// وقتی صفحه کاملاً لود شد
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded!');
    
    // اضافه کردن Event Listener به ورودی‌های مثلث‌ساز
    const sideAB = document.getElementById('sideAB');
    const angleA = document.getElementById('angleA');
    const sideAC = document.getElementById('sideAC');
    
    if (sideAB && angleA && sideAC) {
        sideAB.addEventListener('input', drawTriangle);
        angleA.addEventListener('input', drawTriangle);
        sideAC.addEventListener('input', drawTriangle);
    }
    
    // بارگذاری اولیه
    drawTriangle();
    loadNewQuestion();
});
