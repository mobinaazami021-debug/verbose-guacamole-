function openTab(tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    const tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");

    if (tabName === 'tab-play') {
        drawTriangle();
    }
    if (tabName === 'tab-quiz') {
        loadNewQuestion();
    }
}

function drawTriangle() {
    const canvas = document.getElementById('triangleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resultDiv = document.getElementById('congruenceResult');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sideAB = parseFloat(document.getElementById('sideAB').value) || 5;
    const angleA = parseFloat(document.getElementById('angleA').value) || 60;
    const sideAC = parseFloat(document.getElementById('sideAC').value) || 5;

    const angleARad = angleA * Math.PI / 180;

    const pointA = { x: 100, y: 200 };
    const pointB = { x: pointA.x + sideAB * 20, y: pointA.y };
    const pointC = {
        x: pointA.x + sideAC * 20 * Math.cos(angleARad),
        y: pointA.y - sideAC * 20 * Math.sin(angleARad)
    };

    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.lineTo(pointC.x, pointC.y);
    ctx.closePath();
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(46, 125, 50, 0.1)';
    ctx.fill();

    ctx.fillStyle = 'red';
    ctx.font = '14px Arial';
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

    const sampleSide1 = 5;
    const sampleAngle = 60;
    const sampleSide2 = 5;

    if (sideAB === sampleSide1 && sideAC === sampleSide2 && angleA === sampleAngle) {
        resultDiv.innerHTML = "<p style='color: green;'>آفرین! مثلث شما با مثلث نمونه هم‌نهشت است (حالت ض ز ض).</p>";
    } else {
        resultDiv.innerHTML = "<p style='color: red;'>مثلث شما با مثلث نمونه هم‌نهشت نیست. مقادیر را تغییر دهید و دوباره امتحان کنید!</p>";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const sideAB = document.getElementById('sideAB');
    const angleA = document.getElementById('angleA');
    const sideAC = document.getElementById('sideAC');
    
    if (sideAB) sideAB.addEventListener('input', drawTriangle);
    if (angleA) angleA.addEventListener('input', drawTriangle);
    if (sideAC) sideAC.addEventListener('input', drawTriangle);
    
    drawTriangle();
    loadNewQuestion();
});

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
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];
    
    const questionDiv = document.getElementById('question');
    const optionsDiv = document.getElementById('options');
    const resultDiv = document.getElementById('quizResult');
    
    if (!questionDiv) return;
    
    resultDiv.innerHTML = '';
    questionDiv.innerHTML = <h3>${currentQuestion.question}</h3>;
    
    optionsDiv.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = option;
        optionElement.onclick = function() {
            const allOptions = document.getElementsByClassName('option');
            for (let i = 0; i < allOptions.length; i++) {
                allOptions[i].style.backgroundColor = '#e8f5e9';
            }
            this.style.backgroundColor = '#c8e6c9';
            userAnswer = index;
        };
        optionsDiv.appendChild(optionElement);
    });
}

function checkAnswer() {
    const resultDiv = document.getElementById('quizResult');
    if (!resultDiv) return;
    
    if (userAnswer === null) {
        resultDiv.innerHTML = "<p style='color: orange;'>لطفاً یک گزینه انتخاب کنید!</p>";
        return;
    }
    
    if (userAnswer === currentQuestion.correct) {
        resultDiv.innerHTML = "<p style='color: green;'>✅ پاسخ شما صحیح است! آفرین!</p>";
    } else {
        resultDiv.innerHTML = <p style='color: red;'>❌ متأسفانه پاسخ صحیح نبود. پاسخ صحیح: ${currentQuestion.options[currentQuestion.correct]}</p>;
    }
    
    setTimeout(loadNewQuestion, 3000);
}
